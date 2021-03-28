import { ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition, ICurrency } from "@djonnyx/tornado-types";
import React, { useCallback } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { IActionHandler } from "../../../interfaces";
import { GridList } from "../../layouts/GridList";
import { OrderListItem } from "./OrderListItem";

const ITEM_WIDTH = 218;

interface IOrderListProps {
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    currency: ICurrency;
    onSelectOrder: (order: ICompiledOrder, actionHandler: IActionHandler, isAnyStatus: boolean) => void;
    onSelectOrderPosition: (order: ICompiledOrder, postion: ICompiledOrderPosition, actionHandler: IActionHandler, isAnyStatus: boolean) => void;
}

export const OrderListContainer = React.memo(({ orders, currency, language,
    onSelectOrder, onSelectOrderPosition }: IOrderListProps) => {

    const onSelectOrderHandler = useCallback((order: ICompiledOrder, actionHandler: IActionHandler, isAnyStatus: boolean = false) => {
        onSelectOrder(order, actionHandler, isAnyStatus);
    }, []);

    const onSelectOrderPositionHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, actionHandler: IActionHandler,
        isAnyStatus: boolean) => {
        onSelectOrderPosition(order, position, actionHandler, isAnyStatus);
    }, []);

    return (
        <View style={{ width: "100%" }}>
            <SafeAreaView style={{
                width: "100%",
            }}>
                <ScrollView style={{ width: "100%" }} persistentScrollbar>
                    <GridList style={{ width: "100%" }}
                        padding={10} spacing={6} data={orders || []}
                        itemDimension={ITEM_WIDTH} renderItem={({ item }) => {
                            return <OrderListItem key={item.id} order={item} currency={currency} language={language}
                                onSelectOrder={onSelectOrderHandler} onSelectOrderPosition={onSelectOrderPositionHandler} />
                        }}
                        keyExtractor={(item, index) => item.id}>
                    </GridList>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
})