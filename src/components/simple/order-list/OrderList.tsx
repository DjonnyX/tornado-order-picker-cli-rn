import { ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition, ICurrency } from "@djonnyx/tornado-types";
import React, { useCallback } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { GridList } from "../../layouts/GridList";
import { OrderListItem } from "./OrderListItem";

const ITEM_WIDTH = 218;

interface IOrderListProps {
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    currency: ICurrency;
    onSelectOrder: (order: ICompiledOrder, isAnyStatus: boolean) => void;
    onSelectOrderPosition: (order: ICompiledOrder, postion: ICompiledOrderPosition, isAnyStatus: boolean) => void;
}

export const OrderListContainer = React.memo(({ orders, currency, language,
    onSelectOrder, onSelectOrderPosition }: IOrderListProps) => {

    const onSelectOrderHandler = useCallback((order: ICompiledOrder, isAnyStatus: boolean = false) => {
        onSelectOrder(order, isAnyStatus);
    }, []);

    const onSelectOrderPositionHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, isAnyStatus: boolean) => {
        onSelectOrderPosition(order, position, isAnyStatus);
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