import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import EventEmitter from "eventemitter3";
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { config } from "../../Config";
import { Debounse } from "../../utils/debounse";
import { ScenarioProcessing } from "../scenarios";
import { MenuWizardEventTypes, MenuNodeEventTypes } from "./events";
import { MenuNode } from "./MenuNode";

export class MenuWizard extends EventEmitter {
    static current: MenuWizard;

    protected _stateId: number = 0;
    get stateId() { return this._stateId; }

    set currency(v: ICurrency) {
        if (this._currency !== v) {
            this._currency = v;

            if (!!this._menu) {
                this._menu.setCurrency(v);
            }
        }
    }

    set businessPeriods(v: Array<IBusinessPeriod>) {
        if (this._businessPeriods !== v) {
            this._businessPeriods = v;

            if (!!this._menu) {
                this._menu.setBusinessPeriods(v);
            }
        }
    }

    set orderType(v: ICompiledOrderType) {
        if (this._orderType !== v) {
            this._orderType = v;

            if (!!this._menu) {
                this._menu.setOrderType(v);
                ScenarioProcessing.checkOrderTypeActivity(this._menu, {
                    businessPeriods: this._businessPeriods,
                    orderType: this._orderType,
                });
            }
        }
    }

    set language(v: ICompiledLanguage) {
        if (this._language !== v) {
            this._language = v;

            if (!!this._menu) {
                this._menu.setLanguage(v);
            }
        }
    }

    protected _rawMenu!: ICompiledMenu;
    set rawMenu(v: ICompiledMenu) {
        if (this._rawMenu !== v) {
            this._rawMenu = v;

            if (!!this._menu) {
                this._menu.removeAllListeners();
                this._menu.dispose();

                MenuNode.reset();
            }

            this._menu = new MenuNode(this._rawMenu, null,
                this._businessPeriods,
                this._orderType,
                this._language,
                this._currency);

            if (!!this._orderType) {
                ScenarioProcessing.checkOrderTypeActivity(this._menu, {
                    businessPeriods: this._businessPeriods,
                    orderType: this._orderType,
                });
            }

            this._menu.addListener(MenuNodeEventTypes.CHANGE, this.menuChangeHandler);

            this._changeDebounse.call();
        }
    }

    protected _menu!: MenuNode;
    get menu() { return this._menu; }

    private menuChangeHandler = () => {
        this._changeDebounse.call();
    }

    protected emitChangeState = (): void => {
        this.update();

        this.emit(MenuWizardEventTypes.CHANGE);
    }

    protected _changeDebounse = new Debounse(this.emitChangeState, 10);

    protected _unsubscribe$ = new Subject<void>();

    constructor(protected _currency: ICurrency,
        protected _businessPeriods: Array<IBusinessPeriod>,
        protected _orderType: ICompiledOrderType,
        protected _language: ICompiledLanguage) {
        super();
        MenuWizard.current = this;

        this.startUpdatingTimer();
    }

    protected startUpdatingTimer(): void {
        interval(config.capabilities.checkActivityInterval).pipe(
            takeUntil(this._unsubscribe$),
        ).subscribe(() => {
            this._menu.checkActivity();
        });
    }

    protected updateStateId(): void {
        this._stateId++;
    }

    protected update(): void {
        this.updateStateId();
    }

    dispose(): void {
        this._unsubscribe$.next();
        this._unsubscribe$.complete();

        this._menu.dispose();
    }
}