import { NodeTypes, ICompiledProduct, ICompiledSelector, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { PositionWizardModes, PositionWizardTypes } from "../enums";
import { IPositionWizard, IPositionWizardGroup } from "../interfaces";
import { MenuNodeEventTypes } from "../menu/events";
import { MenuNode } from "../menu/MenuNode";
import { PositionWizardEventTypes } from "./events";
import { PositionWizard } from "./PositionWizard";

export class PositionWizardGroup extends EventEmitter implements IPositionWizardGroup {
    get index() { return this._index; }

    get __node__() { return this._groupNode; }

    protected _positions = new Array<IPositionWizard>();

    get positions() { return this._positions.filter(p => p.active); }

    get allPositions() { return this._positions; }

    get currency() { return this._currency; }

    get discount() {
        let discount = 0;
        this.positions.forEach(p => {
            discount += p.discount;
        });

        return discount;
    }

    protected _isReplacement: boolean = false;
    set isReplacement(v: boolean) {
        if (this._isReplacement !== v) {
            this._isReplacement = v;

            this._positions.forEach(p => {
                p.isReplacement = v;
            });
        }
    }
    get isReplacement() {
        return this._isReplacement;
    }

    protected _isValid: boolean = true;
    set isValid(v: boolean) {
        if (this._isValid !== v) {
            this._isValid = v;
        }
    }
    get isValid() { return this._isValid; }

    protected _active: boolean = true;
    set active(v: boolean) {
        if (this._active !== v) {
            this._active = v;

            this.recalculate();
            this.emit(PositionWizardEventTypes.CHANGE);
        }
    }
    get active() { return this._active; }

    protected _sum: number = 0;
    get sum() { return this._sum; }

    private onChangePositionState = (target: IPositionWizard) => {
        if (this._isReplacement) {
            this._positions.forEach(p => {
                if (p !== target && target.quantity !== 0) {
                    p.quantity = 0;
                }
            });
        }

        this.recalculate();
        this.emit(PositionWizardEventTypes.CHANGE, target);
    }

    private onChangeRawState = () => {
        this.active = this.__node__.active;
    }

    private onPositionEdit = (target: IPositionWizard) => {
        this.emit(PositionWizardEventTypes.EDIT, target);
    }

    constructor(
        protected _index: number,
        protected _groupNode: MenuNode<ICompiledSelector>,
        protected _currency: ICurrency,
        protected _recurtionPass: number,
    ) {
        super();

        this._groupNode.children.forEach((p, index) => {
            if (p.__rawNode__.type === NodeTypes.PRODUCT) {
                const position = new PositionWizard(PositionWizardModes.EDIT, p as MenuNode<ICompiledProduct>,
                    this._currency, PositionWizardTypes.MODIFIER, _recurtionPass);
                position.addListener(PositionWizardEventTypes.CHANGE, this.onChangePositionState);
                position.addListener(PositionWizardEventTypes.EDIT, this.onPositionEdit);

                this.__node__.addListener(MenuNodeEventTypes.CHANGE, this.onChangeRawState);

                this._positions.push(position);
            }
        });

        this.active = this.__node__.active;

        this.recalculate();
    }

    protected recalculate() {
        let sum = 0;
        this.positions.forEach(p => {
            sum += p.sum;
        });

        this._sum = sum;
    }

    getFormatedSum(withCurrency: boolean = false): string {
        let s = priceFormatter(this._sum);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    dispose() {
        this.__node__.removeListener(MenuNodeEventTypes.CHANGE, this.onChangeRawState);

        this._positions.forEach(p => {
            p.removeAllListeners();
            p.dispose();
        });
    }
}