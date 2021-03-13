import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";

interface IOrderListPositionItemProps {
    position: ICompiledOrderPosition;
    currency: ICurrency;
    language: ICompiledLanguage;
}

export const OrderListPositionItem = React.memo(({ currency, language, position }: IOrderListPositionItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {

    }, []);

    /*const currentContent = order.positions.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = !!position.__product__?.tags && position.__product__?.tags?.length > 0
        ? position.__product__?.tags
        : undefined;*/

    return (
        <>
            <View style={{ flex: 1, backgroundColor: "gray", borderRadius: 16, marginBottom: 2 }}>
                <TouchableOpacity style={{ flex: 1, padding: 22 }} onPress={pressHandler}>
                    <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyAlign: "space-around" }}>
                        <Text style={{
                            textAlign: "left", fontSize: 12, flex: 1, fontWeight: "bold",
                            color: theme.themes[theme.name].modifiers.item.descriptionColor, textTransform: "uppercase",
                        }}>
                            {
                                position.product.contents[language.code]?.name
                            }
                        </Text>
                        <Text style={{
                            textAlign: "right", fontSize: 12, fontWeight: "bold",
                            color: theme.themes[theme.name].modifiers.item.descriptionColor, textTransform: "uppercase",
                        }}>
                            x{position.quantity}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={{ width: "100%" }}>
                {
                    position.children.map(p =>
                        <OrderListPositionItem key={p.id} position={p} language={language} currency={currency} />
                    )
                }
            </View>
        </>
    );
});