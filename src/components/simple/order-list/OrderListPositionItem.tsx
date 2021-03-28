import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderPosition } from "@djonnyx/tornado-types";
import { IActionHandler } from "../../../interfaces";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { getPositionStatusTheme } from "../../../utils/statusTheme";

interface IOrderListPositionItemProps {
    onSelect: (postion: ICompiledOrderPosition, actionHandler: IActionHandler, isAnyStatus?: boolean) => void;
    themeName: string;
    position: ICompiledOrderPosition;
    currency: ICurrency;
    language: ICompiledLanguage;
    isModifier?: boolean;
}

export const OrderListPositionItem = React.memo(({ themeName, currency, language, position, isModifier = false, onSelect }: IOrderListPositionItemProps) => {
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

    const statusTheme = getPositionStatusTheme(position.status);
    const backgroundColor = isModifier ? statusTheme?.position.modifier.background : statusTheme?.position.background;
    const textColor = isModifier ? statusTheme?.position.modifier.textColor : statusTheme?.position.textColor;

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
                <View style={{ flex: 1, backgroundColor, borderRadius: 10, marginBottom: 2 }}>
                    <TouchableOpacity style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 20 }} onPress={pressHandler} onLongPress={longPressHandler}>
                        <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-around" }}>
                            <Text style={{
                                textAlign: "left", fontSize: 13, flex: 1, fontWeight: "bold",
                                color: textColor, textTransform: "uppercase",
                                textShadowRadius: 2,
                                textShadowColor: "rgba(0,0,0,0.25)",
                            }}>
                                {
                                    position.product.contents[language.code]?.name
                                }
                            </Text>
                            <Text style={{
                                textAlign: "right", fontSize: 13, fontWeight: "bold",
                                color: textColor, textTransform: "uppercase",
                                textShadowRadius: 2,
                                textShadowColor: "rgba(0,0,0,0.25)",
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
                        <OrderListPositionItem key={p.id} themeName={themeName} position={p} language={language} currency={currency}
                            onSelect={onSelectHandler} isModifier={true} />
                    )
                }
            </View>
        </>
    );
});