import {
    IBusinessPeriod, ICompiledLanguage, ICompiledMenuNode, ICompiledOrderType, ICompiledProduct, ICompiledSelector,
    ICurrency, NodeTypes
} from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { priceFormatter } from "../../utils/price";
import { ScenarioProcessing } from "../scenarios";
import { MenuNodeEventTypes } from "./events";

export class MenuNode<T = ICompiledSelector | ICompiledProduct | any> extends EventEmitter {
    protected static __dictionary: { [id: string]: MenuNode } = {};
    protected static __id = 0;

    public static reset() {
        MenuNode.__dictionary = {};
        MenuNode.__id = 0;
    }

    protected _id: number = 0;

    get id() {
        return this._id;
    }

    get index() {
        return this.__rawNode__.index;
    }

    get type() {
        return this.__rawNode__.type;
    }

    get parent() {
        return this._parent;
    }

    protected _stateId: number = 0;

    protected _price: number = 0;
    set price(v: number) {
        if (this._price !== v) {
            this._price = v;

            this.update();

            this.emit(MenuNodeEventTypes.CHANGE);
        }
    }
    get price() { return this._price; }

    get discount() {
        const product = this.__rawNode__.type === NodeTypes.PRODUCT
            ? this.__rawNode__.content as unknown as ICompiledProduct
            : undefined;
        if (!!product) {
            const discount = this._price - (product.prices[this._currency.id as string]?.value || 0);
            if (discount < 0) {
                return discount;
            }
        }
        return 0;
    }

    get stateId() {
        return this._stateId;
    }

    setCurrency(v: ICurrency, dictionary: { [id: string]: MenuNode } = {}) {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        if (this._currency !== v) {
            this._currency = v;

            this._children.forEach(c => {
                c.setCurrency(v, dictionary);
            });
        }
    }
    get currency() { return this._currency; }

    setBusinessPeriods(v: Array<IBusinessPeriod>, dictionary: { [id: string]: MenuNode } = {}) {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        if (this._businessPeriods !== v) {
            this._businessPeriods = v;

            this._children.forEach(c => {
                c.setBusinessPeriods(v, dictionary);
            });
        }
    }
    get businessPeriods() { return this._businessPeriods; }

    setOrderType(v: ICompiledOrderType, dictionary: { [id: string]: MenuNode } = {}) {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        if (this._orderType !== v) {
            this._orderType = v;

            this._children.forEach(c => {
                c.setOrderType(v, dictionary);
            });
        }
    }
    get orderType() { return this._orderType; }

    setLanguage(v: ICompiledLanguage, dictionary: { [id: string]: MenuNode } = {}) {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        if (this._language !== v) {
            this._language = v;

            this._children.forEach(c => {
                c.setLanguage(v, dictionary);
            });
        }
    }
    get language() { return this._language; }

    protected _children = new Array<MenuNode>();
    get children() { return this._children; }

    protected _activeChildren = new Array<MenuNode>();
    get activeChildren() { return this._children.filter(c => c.active); }

    protected _active: boolean = true;
    public set active(v: boolean) {
        if (this._active !== v) {
            this._active = v;

            this.update();

            this.emit(MenuNodeEventTypes.CHANGE);
        }
    }
    public get active() { return this._active; }

    protected _visibleByBusinessPeriod: boolean = true;
    public set visibleByBusinessPeriod(v: boolean) {
        if (this._visibleByBusinessPeriod !== v) {
            this._visibleByBusinessPeriod = v;

            this.active = this._visibleByOrderType && this._visibleByBusinessPeriod;
        }
    }
    public get visibleByBusinessPeriod() { return this._visibleByBusinessPeriod; }

    protected _visibleByOrderType: boolean = true;
    public set visibleByOrderType(v: boolean) {
        if (this._visibleByOrderType !== v) {
            this._visibleByOrderType = v;

            this.active = this._visibleByOrderType && this._visibleByBusinessPeriod;
        }
    }
    public get visibleByOrderType() { return this._visibleByOrderType; }

    get scenarios() { return this.__rawNode__.scenarios; }

    private changeMenuNodeHandler = () => {
        this.emit(MenuNodeEventTypes.CHANGE);
    }

    constructor(public readonly __rawNode__: ICompiledMenuNode<T>, protected _parent: MenuNode | null,
        protected _businessPeriods: Array<IBusinessPeriod>,
        protected _orderType: ICompiledOrderType,
        protected _language: ICompiledLanguage,
        protected _currency: ICurrency) {
        super();

        MenuNode.__id++;
        this._id = MenuNode.__id;

        MenuNode.__dictionary[__rawNode__.id] = this;

        this.__rawNode__.children.forEach(n => {
            let node: MenuNode;
            if (MenuNode.__dictionary[n.id]) {
                node = MenuNode.__dictionary[n.id];
            } else {
                node = new MenuNode(n, this, _businessPeriods, _orderType, _language, _currency);
                node.addListener(MenuNodeEventTypes.CHANGE, this.changeMenuNodeHandler);
            }
            this._children.push(node);
        });

        if (this.__rawNode__.type === NodeTypes.PRODUCT) {
            const p: ICompiledMenuNode<ICompiledProduct> = this.__rawNode__ as unknown as ICompiledMenuNode<ICompiledProduct>;
            p.content.structure.children.forEach(n => {
                let node: MenuNode;
                if (MenuNode.__dictionary[n.id]) {
                    node = MenuNode.__dictionary[n.id];
                } else {
                    node = new MenuNode(n, this, _businessPeriods, _orderType, _language, _currency);
                    node.addListener(MenuNodeEventTypes.CHANGE, this.changeMenuNodeHandler);
                }
                this._children.push(node);
            });

            ScenarioProcessing.applyCalculatedPrice(this as unknown as MenuNode<ICompiledProduct>, {
                businessPeriods: this._businessPeriods,
                orderType: this._orderType,
            });
        }

        ScenarioProcessing.applyPeriodicScenariosForNode(this, {
            businessPeriods: this._businessPeriods,
            orderType: this._orderType,
        });
    }

    protected update(): void {
        this._stateId++;
    }

    getFormatedPrice(withCurrency: boolean = false): string {
        let s = priceFormatter(this._price);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    getFormatedDiscount(withCurrency: boolean = false): string {
        let s = priceFormatter(this.discount);
        if (withCurrency) {
            s += this._currency.symbol;
        }
        return s;
    }

    /**
     * Проверка активности
     * Проверяются периодические сценарии
     * 
     * dictionary нужен, чтобы предотвратить бесконечный вызов
     * на рекурсивных модификаторах
     */
    checkActivity(dictionary: { [id: string]: MenuNode } = {}): void {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        this._children.forEach(n => {
            n.checkActivity(dictionary);
        })

        ScenarioProcessing.applyPeriodicScenariosForNode(this, {
            businessPeriods: this._businessPeriods,
            orderType: this._orderType,
        });
    }

    /**
     * Полная очистка
     * 
     * dictionary нужен, чтобы предотвратить бесконечный вызов
     * на рекурсивных модификаторах
     */
    dispose(dictionary: { [id: string]: MenuNode } = {}): void {
        if (dictionary[this.__rawNode__.id]) {
            return;
        }

        dictionary[this.__rawNode__.id] = this;

        this.removeAllListeners();

        this._children.forEach(node => {
            node.dispose(dictionary);
        });
    }
}