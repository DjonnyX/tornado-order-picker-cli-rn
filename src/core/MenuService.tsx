import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { IBusinessPeriod, ICompiledLanguage, ICompiledMenu, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import { MenuWizard } from "./menu/MenuWizard";
import { MenuWizardEventTypes } from "./menu/events";
import { MenuActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors } from "../store/selectors";
import { ISnackState } from "../interfaces";
import { OrderWizard } from "./order/OrderWizard";
import { MainNavigationScreenTypes } from "../components/navigation";

interface IMenuServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;

    _menuStateId?: number;
    _menu?: ICompiledMenu;
    _currency?: ICurrency;
    _businessPeriods?: Array<IBusinessPeriod>;
    _orderTypes?: Array<ICompiledOrderType>;

    _language?: ICompiledLanguage;
    _currentOrderType?: ICompiledOrderType;
    _currentScreen: MainNavigationScreenTypes;
}

export const MenuServiceContainer = React.memo(({ _menuStateId, _menu, _language, _currentOrderType,
    _currency, _businessPeriods, _orderTypes, _currentScreen, _snackOpen, _onUpdateStateId }: IMenuServiceProps) => {
    const [menuWizard, setMenuWizard] = useState<MenuWizard | undefined>(undefined);

    useEffect(() => {
        if (menuWizard) {
            const onMenuWizardChange = () => {
                if (!!OrderWizard.current) {
                    OrderWizard.current.fireChangeMenu();
                }

                _onUpdateStateId(menuWizard?.stateId || 0);
            }

            menuWizard.addListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            return () => {
                menuWizard.removeListener(MenuWizardEventTypes.CHANGE, onMenuWizardChange);
            }
        }
    }, [menuWizard]);

    useEffect(() => {
        if (!!_language && !!_currency && !!_businessPeriods && !!_orderTypes && !!_menu) {

            const orderType = _currentOrderType || (_orderTypes.length > 0 ? _orderTypes[0] : {} as any);

            if (!menuWizard) {
                const mw = new MenuWizard(_currency,
                    _businessPeriods,
                    orderType,
                    _language,
                );

                mw.rawMenu = _menu as ICompiledMenu;
                mw.orderType = orderType;
                setMenuWizard(mw);

            } else {
                menuWizard.rawMenu = _menu as ICompiledMenu;
                menuWizard.currency = _currency;
                menuWizard.language = _language;
                menuWizard.businessPeriods = _businessPeriods;
                menuWizard.orderType = orderType;
            }
        }
    }, [_language, _currency, _businessPeriods, _orderTypes, _currentOrderType, _menu]);

    useEffect(() => {
        if ((_currentScreen === MainNavigationScreenTypes.MENU || _currentScreen === MainNavigationScreenTypes.CONFIRMATION_ORDER)
            && !!OrderWizard.current) {
            _snackOpen({
                message: "Изменение в меню! Некоторые позиции в заказе могут стать недоступны.",
                duration: 5000,
            });
        }
    }, [_menuStateId]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
        _menu: CombinedDataSelectors.selectMenu(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _businessPeriods: CombinedDataSelectors.selectBusinessPeriods(state),
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _menuStateId: MenuSelectors.selectStateId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
        _currentOrderType: CapabilitiesSelectors.selectOrderType(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onUpdateStateId: (stateId: number) => {
            dispatch(MenuActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
    };
};

export const MenuService = connect(mapStateToProps, mapDispatchToProps)(MenuServiceContainer as any);