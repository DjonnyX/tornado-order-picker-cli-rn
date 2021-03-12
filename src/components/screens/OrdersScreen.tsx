import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { MenuSelectors } from "../../store/selectors";
import { theme } from "../../theme";

interface IOrdersSelfProps {
    // store props
    _menuStateId: number;

    // self props
}

interface IOrdersProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IOrdersSelfProps { }

const OrdersScreenContainer = React.memo(({ _menuStateId, navigation }: IOrdersProps) => {

    return (
        <View style={{
            flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>

        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const OrdersScreen = connect(mapStateToProps, mapDispatchToProps)(OrdersScreenContainer);