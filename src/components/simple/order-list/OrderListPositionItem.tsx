import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { OrderPositionStatuses } from "@djonnyx/tornado-types";
import { IActionHandler } from "../../../interfaces";
import { ProgressBar } from "@react-native-community/progress-bar-android";

interface IOrderListPositionItemProps {
    onSelect: (postion: ICompiledOrderPosition, actionHandler: IActionHandler, isAnyStatus?: boolean) => void;
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
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const actionHandler = {
        onLoad: () => {
            setIsLoading(true);
        },
        onComplete: () => {
            setIsLoading(false);
        },
    };

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        onSelect(position, actionHandler);
    }, [position]);

    const longPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelect(position, actionHandler, true);
    }, [position]);

    const onSelectHandler = useCallback((position: ICompiledOrderPosition, handler: IActionHandler) => {
        onSelect(position, handler);
    }, [position]);

    return (
        <>
            <View style={{ position: "relative", width: "100%", flex: 1 }}>
                {
                    isLoading &&
                    <View style={{
                        position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.1)",
                        alignItems: "center", justifyContent: "center", zIndex: 1, borderRadius: 16
                    }}>
                        <ProgressBar indeterminate={true} styleAttr="Small" color={"white"}></ProgressBar>
                    </View>
                }
                <View style={{ flex: 1, backgroundColor: getColorByStatus(position.status), borderRadius: 16, marginBottom: 2 }}>
                    <TouchableOpacity style={{ flex: 1, padding: 22 }} onPress={pressHandler} onLongPress={longPressHandler}>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
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