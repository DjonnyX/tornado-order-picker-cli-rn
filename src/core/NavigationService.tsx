import React, { Dispatch, useEffect } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";

interface INavigationServiceProps {
    // store
    _currentScreen?: MainNavigationScreenTypes;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
}

export const NavigationServiceContainer = React.memo(({ onNavigate, _currentScreen }: INavigationServiceProps) => {

    useEffect(() => {
        if (!!_currentScreen && onNavigate !== undefined) onNavigate(_currentScreen as MainNavigationScreenTypes);
    }, [_currentScreen]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {

    };
};

export const NavigationService = connect(mapStateToProps, mapDispatchToProps)(NavigationServiceContainer);