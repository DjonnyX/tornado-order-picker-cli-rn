import React, { Dispatch } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import { ICompiledLanguage, ICompiledOrder, ICurrency } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { OrderListContainer } from "../simple/order-list/OrderList";

interface IOrdersSelfProps {
    // store props
    _menuStateId: number;
    _orders: Array<ICompiledOrder>;
    _currency: ICurrency;
    _language: ICompiledLanguage;

    // self props
}

interface IOrdersProps extends StackScreenProps<any, MainNavigationScreenTypes.ORDERS>, IOrdersSelfProps { }

const OrdersScreenContainer = React.memo(({ _menuStateId, _orders, _language, _currency, navigation }: IOrdersProps) => {

    return (
        <View style={{
            width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <OrderListContainer orders={_orders} currency={_currency} language={_language} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _menuStateId: MenuSelectors.selectStateId(state),
        _orders: CombinedDataSelectors.selectOrders(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {

    };
};

export const OrdersScreen = connect(mapStateToProps, mapDispatchToProps)(OrdersScreenContainer);