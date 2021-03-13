import { ICompiledLanguage, ICompiledOrder, ICurrency } from "@djonnyx/tornado-types";
import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Icons, theme } from "../../../theme";
import { GridList } from "../../layouts/GridList";
import { ModifierListItem } from "./ModifierListItem";
import { OrderListItem } from "./OrderListItem";

const ITEM_WIDTH = 218;

interface IOrderListProps {
    language: ICompiledLanguage;
    orders: Array<ICompiledOrder>;
    currency: ICurrency;
}

export const OrderListContainer = React.memo(({ orders, currency, language }: IOrderListProps) => {
    return (
        <View style={{ width: "100%" }}>
            <SafeAreaView style={{
                width: "100%",
            }}>
                <ScrollView style={{ width: "100%" }} persistentScrollbar>
                    <GridList style={{ width: "100%" }} disbleStartAnimation
                        padding={10} spacing={6} data={orders || []}
                        itemDimension={ITEM_WIDTH} animationSkipFrames={10} renderItem={({ item }) => {
                            return <OrderListItem key={item.id} order={item} currency={currency} language={language} />
                        }}
                        keyExtractor={(item, index) => item.id}>
                    </GridList>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
})