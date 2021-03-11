import React, { Dispatch, useEffect } from "react";
import { connect } from "react-redux";
import { ICompiledLanguage, ICompiledOrderType } from "@djonnyx/tornado-types";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../store/actions";

interface INavigationServiceProps {
    // store
    _showOrderTypes?: () => void;
    _setLanguage?: (language: ICompiledLanguage) => void;
    _setOrderType?: (orderType: ICompiledOrderType) => void;
    _snackClose?: () => void;
    _alertClose?: () => void;
    _languages?: Array<ICompiledLanguage>;
    _orderTypes?: Array<ICompiledOrderType>;
    _orderStateId?: number;
    _currentScreen?: MainNavigationScreenTypes;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
}

export const NavigationServiceContainer = React.memo(({ onNavigate, _orderStateId, _currentScreen, _languages, _orderTypes,
    _setLanguage, _setOrderType, _showOrderTypes, _alertClose, _snackClose }: INavigationServiceProps) => {

    useEffect(() => {
        if (_orderStateId === 0 && (_currentScreen === MainNavigationScreenTypes.MENU
            || _currentScreen === MainNavigationScreenTypes.CONFIRMATION_ORDER
            || _currentScreen === MainNavigationScreenTypes.PAY_CONFIRMATION)) {

            if (_alertClose !== undefined) _alertClose();
            if (_snackClose !== undefined) _snackClose();
            if (_setLanguage !== undefined) {
                const defaultLanguage = _languages?.find(lang => lang.isDefault);
                if (!!defaultLanguage) {
                    _setLanguage(defaultLanguage);
                }
            }
            if (_setOrderType !== undefined) {
                const defaultOrderType = _orderTypes?.find(ot => ot.isDefault);
                if (!!defaultOrderType) {
                    _setOrderType(defaultOrderType);
                }
            }
            if (onNavigate !== undefined) onNavigate(MainNavigationScreenTypes.INTRO);
        } else
            if (_orderStateId === 1 && _currentScreen !== MainNavigationScreenTypes.MENU) {
                if (_showOrderTypes !== undefined) {
                    _showOrderTypes();
                }
                if (onNavigate !== undefined) {
                    onNavigate(MainNavigationScreenTypes.MENU);
                }
            }
    }, [_orderStateId, _currentScreen, onNavigate]);

    useEffect(() => {
        if (!!_currentScreen && onNavigate !== undefined) onNavigate(_currentScreen as MainNavigationScreenTypes);
    }, [_currentScreen]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _orderTypes: CombinedDataSelectors.selectOrderTypes(state),
        _languages: CombinedDataSelectors.selectLangages(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _setLanguage: (language: ICompiledLanguage) => {
            dispatch(CapabilitiesActions.setLanguage(language));
        },
        _setOrderType: (orderType: ICompiledOrderType) => {
            dispatch(CapabilitiesActions.setOrderType(orderType));
        },
        _snackClose: () => {
            dispatch(NotificationActions.snackClose());
        },
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
        _showOrderTypes: () => {
            dispatch(MyOrderActions.updateShowOrderTypes(true));
        }
    };
};

export const NavigationService = connect(mapStateToProps, mapDispatchToProps)(NavigationServiceContainer);