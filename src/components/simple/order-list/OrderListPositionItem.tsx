import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { OrderPositionStatuses } from "@djonnyx/tornado-types";

interface IOrderListPositionItemProps {
    onSelect: (postion: ICompiledOrderPosition, isAnyStatus?: boolean) => void;
    position: ICompiledOrderPosition;
    currency: ICurrency;
    language: ICompiledLanguage;
}

const getColorByStatus = (status: OrderPositionStatuses): string => {
    switch (status) {
        case OrderPositionStatuses.NEW: {
            return "gray";
        }
        case OrderPositionStatuses.IN_PROCESS: {
            return "yellow";
        }
        case OrderPositionStatuses.COMPLETE: {
            return "green";
        }
    }
    return "1e1e1e";
}

export const OrderListPositionItem = React.memo(({ currency, language, position, onSelect }: IOrderListPositionItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        onSelect(position);
    }, [position]);

    const longPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelect(position, true);
    }, [position]);

    const onSelectHandler = useCallback((position: ICompiledOrderPosition) => {
        onSelect(position);
    }, [position]);

    return (
        <>
            <View style={{ flex: 1, backgroundColor: getColorByStatus(position.status), borderRadius: 16, marginBottom: 2 }}>
                <TouchableOpacity style={{ flex: 1, padding: 22 }} onPress={pressHandler} onLongPress={longPressHandler}>
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
                    position.children.filter(p => !!p.product).map(p =>
                        <OrderListPositionItem key={p.id} position={p} language={language} currency={currency} onSelect={onSelectHandler} />
                    )
                }
            </View>
        </>
    );
});