import EventEmitter from "eventemitter3";
import { ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { PositionWizardEventTypes } from "./events";
import { PositionWizardGroup } from "./PositionWizardGroup";
import { priceFormatter } from "../../utils/price";
import { ScenarioProcessing } from "../scenarios";
import { MenuNode } from "../menu/MenuNode";
import { MenuNodeEventTypes } from "../menu/events";

/**
 * Максимальная глубина рекурсии
 * Это значение реализует бесконечную рекурсию добвления циклических модификаторов
 * 
 * !!!при расчете цены, ошибка скидки
 */
const MAX_RECURTION_DEPTH = 2;

export class PositionWizard extends EventEmitter implements IPositionWizard {
    static MAX_AVAILABLE_LIMIT = 99;

    protected static __id = 0;

    static from(position: IPositionWizard, mode: PositionWizardModes, type: PositionWizardTypes = PositionWizardTypes.PRODUCT): IPositionWizard {
        const editedPosition = new PositionWizard(mode, position.__node__,
            position.currency, type);

        PositionWizard.copyAttributes(position, editedPosition);

        return editedPosition;
    }

    static copyAttributes(src: IPositionWizard, position: IPositionWizard) {
        position.quantity = src.quantity;

        position.allGroups.forEach((g, i) => {
            g.allPositions.forEach((p, j) => {
                if (!!src?.allGroups[i]?.allPositions[j] && !!p) {
                    PositionWizard.copyAttributes(src.allGroups[i].allPositions[j], p);
                }
            });
        });
    }

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    protected _stateId: number = 0;

    get stateId() {
        return this._stateId;
    }

    get type() {
        return this._type;
    }

    get rests() {
        return 10; // нужно сделать rests у продукта
    }

    get availableQuantitiy() {
        return Math.min(this.rests, this._actualUpLimit);
    }

    protected _isReplacement: boolean = false;
    set isReplacement(v: boolean) {
        if (this._isReplacement !== v) {
            this._isReplacement = v;
        }
    }
    get isReplacement() {
        return this._isReplacement;
    }

    get mode() { return this._mode; }

    get __product__() { return this._product; }

    get price() { return this.__node__.price; }

    get discount() { return this.__node__.discount; }

    get discountPerOne() {
        let discount = 0;
        this.groups.forEach(g => {
            discount += g.discount;
        });
        return discount + this.discount;
    }

    get discountSum() {
        return this.discountPerOne * this._quantity;
    }

    get currency() { return this._currency; }

    protected _quantity: number = 0;
    get quantity() { return this._quantity; }
    set quantity(v: number) {
        if (this._quantity !== v) {
            this._quantity = v;

            this.validate();
            this.recalculate();
            this.update();

            this.emit(PositionWizardEventTypes.CHANGE, this);

            if (this.type === PositionWizardTypes.MODIFIER) {
                if (this._quantity > 0 && this._groups.length > 0 && !this._isValid) {
                    this.emit(PositionWizardEventTypes.EDIT, this);
                }
            }
        }
    }

    protected _groups = new Array<IPositionWizardGroup>();

    get groups() { return this._groups.filter(g => g.active); }

    get allGroups() { return this._groups; }

    protected _active: boolean = true;
    set active(v: boolean) {
        if (this._active !== v) {
            this._active = v;

            // При смене например БП, нужно сбрасывать индекс текущей группы
            // т.к. группа с индексом может стать неактивной и произойдет ошибка
            this._currentGroup = 0;

            this.validate();
            this.recalculate();
            this.update();

            this.emit(PositionWizardEventTypes.CHANGE, this);
        }
    }
    get active() { return this._active; }

    protected _isValid: boolean = true;
    set isValid(v: boolean) {
        if (this._isValid !== v) {
            this._isValid = v;
        }
    }
    get isValid() { return this._isValid; }

    protected _downLimit: number = 0;
    set downLimit(v: number) {
        if (this._downLimit !== v) {
            this._downLimit = v;
        }
    }
    get downLimit() { return this._downLimit; }

    protected _upLimit: number = PositionWizard.MAX_AVAILABLE_LIMIT;
    set upLimit(v: number) {
        if (this._upLimit !== v) {
            this._upLimit = this._actualUpLimit = v === 0 ? PositionWizard.MAX_AVAILABLE_LIMIT : v;
        }
    }
    get upLimit() { return this._upLimit; }

    protected _actualUpLimit: number = PositionWizard.MAX_AVAILABLE_LIMIT;
    set actualUpLimit(v: number) {
        if (this._actualUpLimit !== v) {
            this._actualUpLimit = v;
            this.update();
        }
    }
    /**
     * Динамический верхний предел
     * Выставляется из расчета вычисления действительно доступного количества в группе
     * Связан на прямую с сценариями группы
     */
    get actualUpLimit() { return this._actualUpLimit; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    protected _sumPerOne: number = 0;
    get sumPerOne() { return this._sumPerOne; }

    protected _currentGroup: number = 0;
    set currentGroup(v: number) {
        if (this._currentGroup !== v) {
            this._currentGroup = v;
        }
    }
    get currentGroup() { return this._currentGroup; }

    get nestedPositions() {
        const result = new Array<IPositionWizard>();
        this.groups.forEach(g => {
            g.positions.forEach(p => {
                if (p.quantity > 0) {
                    result.push(p);
                    result.push(...p.nestedPositions);
                }
            });
        });

        return result;
    }

    private onChangePositionState = () => {
        // etc

        this.validate();
        this.recalculate();
        this.update();

        this.emit(PositionWizardEventTypes.CHANGE, this);
    }

    private onChangeRawState = () => {
        this.active = this.__node__.active;

        this.validate();
        this.recalculate();
        this.update();

        this.emit(PositionWizardEventTypes.CHANGE, this);
    }

    private onEditPosition = (target: IPositionWizard) => {
        this.emit(PositionWizardEventTypes.EDIT, target);
    }

    protected _product!: ICompiledProduct;

    constructor(
        protected _mode: PositionWizardModes,
        public readonly __node__: MenuNode<ICompiledProduct>,
        protected _currency: ICurrency,
        protected _type: PositionWizardTypes,
        protected _recurtionPass = MAX_RECURTION_DEPTH,
    ) {
        super();

        PositionWizard.__id++;
        this._id = PositionWizard.__id;

        this._product = __node__.__rawNode__.content;

        if (_recurtionPass > 0) {
            this.__node__.children.forEach((s, index) => {
                const group = new PositionWizardGroup(index, s as MenuNode<ICompiledSelector>,
                    this._currency, _recurtionPass - 1);
                group.addListener(PositionWizardEventTypes.CHANGE, this.onChangePositionState);
                group.addListener(PositionWizardEventTypes.EDIT, this.onEditPosition);

                this._groups.push(group);
            });
        }

        if (this._type === PositionWizardTypes.PRODUCT) {
            ScenarioProcessing.setupPosition(this);
        }

        this.__node__.addListener(MenuNodeEventTypes.CHANGE, this.onChangeRawState);

        this.active = this.__node__.active;

        this.validate();
        this.recalculate();
        this.update();
    }

    protected recalculate() {
        let sum = 0;
        this.groups.forEach(g => {
            sum += g.sum;
        });

        this._sumPerOne = sum + this.price;

        this._sum = this._sumPerOne * this._quantity;
    }

    /**
     * Валидация происходит от корневого продукта
     * Описание:
     * Сначала эмитяся события PositionWizardEventTypes.CHANGE до корневого продукта,
     * далее вызывается низходящая рекурсивная валидация, которая проставляет статусы
     * валидности у групп и модификаторов.
     * Так происходит при каждом изменении любой части состояния продукта
     */
    protected validate(): boolean {
        if (this._type === PositionWizardTypes.PRODUCT) {
            this._isValid = ScenarioProcessing.validatePosition(this);
        }

        return this._isValid;
    }

    protected update(): void {
        this._stateId++;
    }

    updateState() {
        this.update();

        this.emit(PositionWizardEventTypes.CHANGE, this);
    }

    edit(): boolean {
        if (this._mode === PositionWizardModes.NEW) {
            throw Error("Position with mode \"new\" cannot be edited.");
        }

        if (this.groups.length > 0) {
            this.emit(PositionWizardEventTypes.EDIT, this);
            return true;
        }

        return false;
    }

    getFormatedPrice(withCurrency: boolean = false): string {
        let s = priceFormatter(this.price);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedSumPerOne(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sumPerOne);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedDiscount(withCurrency: boolean = false): string {
        return this.__node__.getFormatedDiscount(withCurrency);
    }

    getFormatedDiscountSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this.discountSum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedDiscountPerOne(withCurrency: boolean = false): string {
        let s = priceFormatter(this.discountPerOne);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        this.__node__.removeListener(MenuNodeEventTypes.CHANGE, this.onChangeRawState);

        this._groups.forEach(g => {
            g.removeAllListeners();
            g.dispose();
        });
    }
}