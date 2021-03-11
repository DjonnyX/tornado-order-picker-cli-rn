import React, { Dispatch, useCallback, useEffect, useRef } from "react";
import { StatusBar } from "react-native";
import { connect } from "react-redux";
import { CapabilitiesActions } from "../store/actions";
import {
    AlertService, AuthService, DataCollectorService, NavigationService,
    OrderService, SnackService, UserIdleService
} from "../core";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { MainNavigationScreenTypes, MainNavigationStack } from "./navigation";
import { IAppState } from "../store/state";
import { MenuService } from "../core/MenuService";

interface IMainProps {
    // store props
    _setCurrentScreen?: (screen: MainNavigationScreenTypes) => void;
    // self props
}

const MainContainer = React.memo(({ _setCurrentScreen }: IMainProps) => {
    const navRef = useRef<NavigationContainerRef>();

    useEffect(() => {
        if (_setCurrentScreen !== undefined) {
            _setCurrentScreen(MainNavigationScreenTypes.AUTH);
        }
    }, []);

    const onNavigate = useCallback((screen: MainNavigationScreenTypes) => {
        navRef.current?.navigate(screen);
    }, [navRef]);

    return (
        <>
            {/** services */}
            <NavigationService onNavigate={onNavigate} />
            <MenuService />
            <OrderService />
            <AuthService />
            <DataCollectorService />
            <AlertService />

            {/** components */}
            <UserIdleService>
                <StatusBar hidden={true} />
                <NavigationContainer ref={navRef as any} onStateChange={(s) => {
                    if (_setCurrentScreen !== undefined) {
                        _setCurrentScreen(s?.routes[s.index].name as MainNavigationScreenTypes);
                    }
                }}>
                    <MainNavigationStack />
                </NavigationContainer>
            </UserIdleService>
            {/** snack */}
            <SnackService />
        </>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IMainProps) => {
    return {

    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _setCurrentScreen: (screen: MainNavigationScreenTypes) => {
            dispatch(CapabilitiesActions.setCurrentScreen(screen));
        },
    };
};

export const Main = connect(mapStateToProps, mapDispatchToProps)(MainContainer);