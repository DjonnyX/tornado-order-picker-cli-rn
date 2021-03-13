import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrder } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { OrderListPositionItem } from "./OrderListPositionItem";

interface IOrderListItemProps {
    order: ICompiledOrder;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const OrderListItem = React.memo(({ currency, language, order }: IOrderListItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {

    }, []);

    /*const currentContent = order.positions.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = !!position.__product__?.tags && position.__product__?.tags?.length > 0
        ? position.__product__?.tags
        : undefined;*/

    return (
        <View style={{ flex: 1, backgroundColor: "#2e2e2e", borderRadius: 16 }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1, padding: 22 }} onPress={pressHandler}>
                <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                    textAlign: "center", fontSize: 16, fontWeight: "bold",
                    color: "#ffffff", textTransform: "uppercase",
                    marginBottom: 12
                }}>
                    {
                        order?.code
                    }
                </Text>
                <View style={{ width: "100%" }}>
                    {
                        order.positions.map(p =>
                            <OrderListPositionItem key={p.id} position={p} language={language} currency={currency} />
                        )
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
});