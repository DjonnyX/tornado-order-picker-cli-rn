import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { theme } from "../../../theme";
import { IPositionWizard } from "../../../core/interfaces";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { IAlertState } from "../../../interfaces";

interface ConfirmationOrderListItemProps {
    color?: string;
    stateId: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
    alertOpen: (alert: IAlertState) => void;
}

export const ConfirmationOrderListItem = React.memo(({ stateId, color, currency, language, position,
    alertOpen }: ConfirmationOrderListItemProps) => {
    const currentContent = position.__product__?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        position.edit();
    }, []);

    const setQuantity = (qnt: number) => {
        position.quantity = qnt;
    }

    const changeQuantityHandler = (value: number) => {
        if (value < 1) {
            alertOpen({
                title: "Внимание!", message: "Вы действительно хотите удалить позицию?", buttons: [
                    {
                        title: "Удалить",
                        action: () => {
                            OrderWizard.current.remove(position);
                        }
                    },
                    {
                        title: "Отмена",
                        action: () => {
                            setQuantity(1);
                        }
                    }
                ]
            });

            return;
        }

        setQuantity(value);
    };

    return (
        <View style={{
            flex: 1, flexDirection: "row", paddingLeft: 28, paddingRight: 28, paddingTop: 18, paddingBottom: 18,
            backgroundColor: color || "transparent",
            alignItems: "stretch",
        }}>
            <TouchableOpacity style={{
                flex: 1, flexDirection: "row",
                alignItems: "stretch"
            }} onPress={pressHandler}>
                <View style={{ width: 48, height: 48, marginRight: 20, justifyContent: "flex-end" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <View style={{ flex: 1, marginTop: 8 }}>
                    <View style={{ flexDirection: "row", marginRight: 20, alignItems: "baseline" }}>
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={3} ellipsizeMode="tail" style={{
                                textAlign: "left", fontSize: 20,
                                color: theme.themes[theme.name].confirmation.item.nameColor, textTransform: "uppercase", fontWeight: "bold"
                            }}>
                                {
                                    currentContent?.name
                                }
                            </Text>
                        </View>
                        <View style={{ width: 192, justifyContent: "flex-end" }}>
                            <Text style={{
                                textAlign: "right", fontSize: 24,
                                color: theme.themes[theme.name].confirmation.item.price.textColor, fontWeight: "bold"
                            }}>
                                {
                                    `${position.quantity}x${position.getFormatedSumPerOne(true)}`
                                }
                            </Text>
                        </View>
                    </View>
                    <View>
                        {
                            position.nestedPositions.map(p => <View style={{ flexDirection: "row", marginRight: 20 }}>
                                <View style={{ flex: 1 }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                        textAlign: "left", fontSize: 13,
                                        color: theme.themes[theme.name].confirmation.nestedItem.nameColor,
                                        textTransform: "uppercase", fontWeight: "bold"
                                    }}>
                                        {
                                            p.__product__?.contents[language?.code].name
                                        }
                                    </Text>
                                </View>
                                <View style={{ width: 192 }}>
                                    <Text numberOfLines={1} ellipsizeMode="tail" style={{
                                        textAlign: "right", fontSize: 12,
                                        color: theme.themes[theme.name].confirmation.nestedItem.price.textColor, fontWeight: "bold"
                                    }}>
                                        {
                                            `${p.quantity}x${p.getFormatedPrice(true)}`
                                        }
                                    </Text>
                                </View>
                            </View>
                            )
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <View style={{ width: 144, height: 44 }}>
                <NumericStapper
                    value={position.quantity}
                    buttonStyle={{
                        width: 44, height: 44, borderRadius: 16,
                        backgroundColor: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.backgroundColor,
                        borderColor: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.borderColor,
                        padding: 6
                    }}
                    disabledButtonStyle={{
                        width: 44, height: 44, borderRadius: 16,
                        backgroundColor: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.disabledBackgroundColor,
                        borderColor: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.disabledBorderColor,
                        padding: 6
                    }}
                    buttonTextStyle={{
                        fontSize: 16, fontWeight: "bold",
                        color: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.textColor as any,
                    }}
                    disabledButtonTextStyle={{
                        fontSize: 16, fontWeight: "bold",
                        color: theme.themes[theme.name].confirmation.item.quantityStepper.buttons.disabledTextColor
                    }}
                    textStyle={{
                        width: 24, fontSize: 16, fontWeight: "bold",
                        color: theme.themes[theme.name].confirmation.item.quantityStepper.indicator.textColor
                    }}
                    iconDecrement="-"
                    iconIncrement="+"
                    min={0}
                    max={Math.min(position.rests, 99)}
                    onChange={changeQuantityHandler}
                />
            </View>
        </View>
    );
})