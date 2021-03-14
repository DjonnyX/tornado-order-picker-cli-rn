import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { OrderListPositionItem } from "./OrderListPositionItem";
import { OrderStatuses } from "@djonnyx/tornado-types";

interface IOrderListItemProps {
    order: ICompiledOrder;
    currency: ICurrency;
    language: ICompiledLanguage;
    onSelectOrder: (order: ICompiledOrder, isAnyStatus?: boolean) => void;
    onSelectOrderPosition: (order: ICompiledOrder, postion: ICompiledOrderPosition, isAnyStatus: boolean) => void;
}

const getColorByStatus = (status: OrderStatuses): string => {
    switch (status) {
        case OrderStatuses.NEW: {
            return "#2e2e2e";
        }
        case OrderStatuses.IN_PROCESS: {
            return "yellow";
        }
        case OrderStatuses.COMPLETE: {
            return "green";
        }
    }
    return "1e1e1e";
}

export const OrderListItem = React.memo(({ currency, language, order,
    onSelectOrder, onSelectOrderPosition }: IOrderListItemProps) => {

    const onPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelectOrder(order);
    }, [order]);

    const onLongPressHandler = useCallback((e: GestureResponderEvent) => {
        onSelectOrder(order, true);
    }, [order]);

    const onPositionSelectHandler = useCallback((position: ICompiledOrderPosition, isAnyStatus: boolean = false) => {
        onSelectOrderPosition(order, position, isAnyStatus);
    }, [order]);

    return (
        <View style={{ flex: 1, backgroundColor: getColorByStatus(order.status), borderRadius: 16 }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1, padding: 22 }} onPress={onPressHandler}
                onLongPress={onLongPressHandler}>
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
                        !!order?.positions && order.positions.filter(p => !!p.product).map(p =>
                            <OrderListPositionItem key={p.id} position={p} language={language} currency={currency} onSelect={onPositionSelectHandler} />
                        )
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
});