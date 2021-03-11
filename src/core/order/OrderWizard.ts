import { ICompiledLanguage, ICompiledOrderType, ICompiledProduct, ICurrency, IOrder } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { IOrderData, IOrderPositionData } from "../../services";
import { Debounse } from "../../utils/debounse";
import { priceFormatter } from "../../utils/price";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { IOrderWizard, IPositionWizard } from "../interfaces";
import { MenuNode } from "../menu/MenuNode";
import { PositionWizard } from "../position-wizard";
import { PositionWizardEventTypes } from "../position-wizard/events";
import { OrderWizardEventTypes } from "./events";

export class OrderWizard extends EventEmitter implements IOrderWizard {
    static current: OrderWizard;

    public result: IOrder | undefined;

    protected _stateId: number = 0;
    get stateId() { return this._stateId; }

    protected _positions = new Array<IPositionWizard>();
    get positions() { return this._positions; }

    get currentPosition() {
        return this._editingPositions.length > 0 ? this._editingPositions[this._editingPositions.length - 1] : null;
    }

    protected _editingPositions = new Array<IPositionWizard>();
    get editingPositions() { return this._editingPositions; }

    protected _originalEditingPositions = new Array<IPositionWizard>();

    get originalEditingPosition() {
        return this._originalEditingPositions.length > 0 ? this._originalEditingPositions[this._originalEditingPositions.length - 1] : null;
    }

    protected _lastPosition: IPositionWizard | null = null;
    get lastPosition() { return this._lastPosition; }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;
        }
    }

    set orderType(v: ICompiledOrderType) {
        if (this._orderType !== v) {
            this._orderType = v;
        }
    }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    protected _discount: number = 0;
    get discount() { return this._discount; }

    public readonly fireChangeMenu = () => {
        const currentPosition = this.currentPosition;
        if (currentPosition) {
            if (currentPosition.groups.length === 0) {
                this.editCancel();
            } else {
                this.resetAndEdit();
            }
        }

        this.removeInvalidOrders();
    }

    private onChangePosition = () => {
        this.update();

        this._changeDebounse.call();
    }

    private onEditPosition = (position: IPositionWizard) => {
        if (position.mode === PositionWizardModes.NEW && position.type === PositionWizardTypes.PRODUCT) {
            return;
        }

        if (position.groups.length > 0) {
            if (position.type === PositionWizardTypes.MODIFIER) {
                this._originalEditingPositions.push(position);
                const editedPosition = PositionWizard.from(position, PositionWizardModes.EDIT, position.type);
                editedPosition.addListener(PositionWizardEventTypes.CHANGE, this.onChangePosition);
                editedPosition.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);
                this.edit(editedPosition);
            } else
                if (position.type === PositionWizardTypes.PRODUCT) {
                    const editedPosition = this.add(position, true);
                    this.edit(editedPosition);
                }
        }
    }

    protected emitChangeState = (): void => {
        this.emit(OrderWizardEventTypes.CHANGE);
    }

    protected _changeDebounse = new Debounse(this.emitChangeState, 10);

    constructor(protected _currency: ICurrency, protected _language: ICompiledLanguage,
        protected _orderType: ICompiledOrderType) {
        super();
        OrderWizard.current = this;
    }

    protected resetAndEdit() {
        const currentPosition = this.currentPosition;
        if (!currentPosition) {
            return;
        }

        const pos = PositionWizard.from(currentPosition, currentPosition.mode);
        pos.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);

        this.editCancel(false);

        this.edit(pos);
    }

    protected recalculate() {
        let sum = 0, discount = 0;
        this._positions.forEach(p => {
            sum += p.sum;
            discount += p.discountSum;
        });

        this._sum = sum;
        this._discount = discount;
    }

    protected updateStateId(): void {
        this._stateId++;
    }

    protected update(): void {
        this.recalculate();
        this.updateStateId();
    }

    protected removeInvalidOrders(): void {
        const positions = [...this._positions];

        while (positions.length > 0) {
            const p = positions.pop();
            if (p && !p.isValid) {
                this.remove(p);
            }
        }
    }

    gotoPreviousGroup(): void {
        if (!this.currentPosition) {
            return;
        }

        if (this.currentPosition.groups.length > 0) {
            this.currentPosition.currentGroup--;

            this.updateStateId();

            this._changeDebounse.call();
        }
    }

    gotoNextGroup(): void {
        const currentPosition = this.currentPosition;
        if (!currentPosition) {
            return;
        }

        if (currentPosition.currentGroup < currentPosition.groups.length - 1) {
            currentPosition.currentGroup++;

            this.updateStateId();

            this._changeDebounse.call();
        } else {
            if (currentPosition.type === PositionWizardTypes.MODIFIER) {
                if (currentPosition.quantity === 0) {
                    currentPosition.quantity = 1;
                }
            }
            if (currentPosition.mode === PositionWizardModes.EDIT) {
                if (!!this.originalEditingPosition) {
                    PositionWizard.copyAttributes(currentPosition, this.originalEditingPosition);
                }
            } else
                if (currentPosition.mode === PositionWizardModes.NEW) {
                    this.add(currentPosition);
                }

            this.editCancel();
        }
    }

    findPosition(position: IPositionWizard): IPositionWizard | undefined {
        return this._positions.find(p => p.id === position.id);
    }

    new(): void {
        this._stateId = 1;
        this._sum = 0;

        this._changeDebounse.call();
    }

    editProduct(productNode: MenuNode<ICompiledProduct>) {
        const existsProduct = this._positions.find(pos => pos.__node__.__rawNode__.id === productNode.__rawNode__.id);
        if (!!existsProduct && existsProduct.groups.length === 0) {
            // Добавление количества к существующему продукту,
            // у которого не возможны модификации
            existsProduct.quantity++;
        } else {
            const position = new PositionWizard(PositionWizardModes.NEW, productNode, this._currency,
                PositionWizardTypes.PRODUCT);
            position.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);
            position.quantity = 1;

            if (position.groups.length === 0) {
                // Добавление нового продукта
                this.add(position);
                position.dispose();
            } else {
                // Открытие конфигуратора добавляемого продукта
                this._editingPositions.push(position);
                this.update();
                this._changeDebounse.call();
            }
        }
    }

    edit(position: IPositionWizard) {
        this._editingPositions.push(position);

        this.update();

        this._changeDebounse.call();
    }

    editCancel(clearOriginal: boolean = true): void {
        const currentPosition = this.currentPosition;

        if (!currentPosition) {
            return;
        }

        currentPosition.currentGroup = 0;

        currentPosition.removeAllListeners();
        currentPosition.dispose();

        this._editingPositions.splice(this._editingPositions.findIndex(ep => ep === currentPosition), 1);

        if (clearOriginal) {
            if (this._originalEditingPositions.length > 0) {
                this._originalEditingPositions.pop();
            }
        }

        this.update();

        this._changeDebounse.call();
    }

    add(position: IPositionWizard, isTemp: boolean = false): IPositionWizard {
        const editedPosition = PositionWizard.from(position, PositionWizardModes.EDIT);
        editedPosition.addListener(PositionWizardEventTypes.CHANGE, this.onChangePosition);
        editedPosition.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);

        if (isTemp) {
            this._originalEditingPositions.push(position);
        } else {
            this._positions.push(editedPosition);
            this._lastPosition = editedPosition;
        }

        this.update();

        this._changeDebounse.call();

        return editedPosition;
    }

    remove(position: IPositionWizard): void {
        this._positions.splice(this._positions.findIndex(p => p.id === position.id), 1);

        position.removeAllListeners();
        position.dispose();

        this.update();

        this._changeDebounse.call();
    }

    reset(): void {
        this._positions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
        this._positions = [];

        this._editingPositions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
        this._editingPositions = [];

        this._originalEditingPositions = [];

        this._lastPosition = null;
        
        this.result = undefined;

        this._stateId = 0;
        this._discount = 0;
        this._sum = 0;

        this._changeDebounse.call();
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    protected toOrderPosition(positionWizard: IPositionWizard): IOrderPositionData {
        const nestedPositions = positionWizard.nestedPositions;
        const position: IOrderPositionData = {
            productId: positionWizard.__product__?.id as string,
            price: positionWizard.price,
            sum: positionWizard.sum,
            discount: positionWizard.discountSum,
            quantity: positionWizard.quantity,
            children: nestedPositions.map(pos => this.toOrderPosition(pos)),
        }

        return position;
    }

    toOrderData(): IOrderData {
        const positions = this._positions.map(pos => this.toOrderPosition(pos));
        const order: IOrderData = {
            sum: this._sum,
            discount: this._discount,
            currencyId: this._currency.id as string,
            orderTypeId: this._orderType.id as string,
            positions,
        };

        return order;
    }

    dispose(): void {
        this._positions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });

        this._editingPositions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });

        this._originalEditingPositions = [];
        this._lastPosition = null;
        this.result = undefined;
    }
}