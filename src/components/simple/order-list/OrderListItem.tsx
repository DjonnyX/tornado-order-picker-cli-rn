import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { ICurrency, ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { OrderListPositionItem } from "./OrderListPositionItem";
import { IActionHandler } from "../../../interfaces";
import { getOrderStatusTheme } from "../../../utils/statusTheme";

interface IOrderListItemProps {
    order: ICompiledOrder;
    currency: ICurrency;
    language: ICompiledLanguage;
    onSelectOrder: (order: ICompiledOrder, actionHandler: IActionHandler, isAnyStatus?: boolean) => void;
    onSelectOrderPosition: (order: ICompiledOrder, postion: ICompiledOrderPosition, actionHandler: IActionHandler, isAnyStatus: boolean) => void;
}

export const OrderListItem = React.memo(({ currency, language, order,
    onSelectOrder, onSelectOrderPosition }: IOrderListItemProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const actionHandler = {
        onLoad: () => {
            setIsLoading(true);
        },
        onComplete: () => {
            setIsLoading(false);
        },
    };

    const onPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelectOrder(order, actionHandler);
    }, [order]);

    const onLongPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelectOrder(order, actionHandler, true);
    }, [order]);

    const onPositionSelectHandler = useCallback((position: ICompiledOrderPosition, actionHandler: IActionHandler, isAnyStatus: boolean = false) => {
        onSelectOrderPosition(order, position, actionHandler, isAnyStatus);
    }, [order]);

    const statusTheme = getOrderStatusTheme(order.status);

    return (
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
            <View style={{ flex: 1, backgroundColor: statusTheme?.background, borderRadius: 16 }}>
                <TouchableOpacity style={{ alignItems: "center", flex: 1, padding: 16 }} onPress={onPressHandler}
                    onLongPress={onLongPressHandler}>
                    <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                        textAlign: "center", fontSize: 16, fontWeight: "bold",
                        color: statusTheme?.textColor, textTransform: "uppercase",
                        textShadowRadius: 2,
                        textShadowColor: "rgba(0,0,0,0.25)",
                        marginBottom: 12
                    }}>
                        {
                            order?.code
                        }
                    </Text>
                    <View style={{ width: "100%" }}>
                        {
                            !!order?.positions && order.positions.filter(p => !!p.product).map(p =>
                                <OrderListPositionItem key={p.id} position={p} language={language} currency={currency} onSelect={onPositionSelectHandler} />
                            )
                        }
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
});