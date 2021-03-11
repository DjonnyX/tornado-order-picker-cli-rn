import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { NumericStapper } from "../NumericStapper";
import { theme } from "../../../theme";
import { IPositionWizard } from "../../../core/interfaces";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { IAlertState } from "../../../interfaces";

interface IMyOrderListItemItemProps {
    stateId: number;
    menuStateId: number;
    imageHeight: number;
    position: IPositionWizard;
    currency: ICurrency;
    language: ICompiledLanguage;
    alertOpen: (alert: IAlertState) => void;
}

export const MyOrderListItem = React.memo(({ stateId, menuStateId, imageHeight, currency, language, position,
    alertOpen }: IMyOrderListItemItemProps) => {
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
        <View style={{ flex: 1, paddingLeft: 24, paddingRight: 24, marginBottom: 20 }}>
            <TouchableOpacity style={{ alignItems: "center" }} onPress={pressHandler}>
                <View style={{ flex: 1, width: "100%", height: imageHeight, marginBottom: 2, justifyContent: "flex-end" }}>
                    <FastImage style={{ width: "100%", height: "100%" }} source={{
                        uri: `file://${currentAdAsset?.mipmap.x128}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                </View>
                <Text numberOfLines={3} ellipsizeMode="tail" style={{
                    textAlign: "center", fontSize: 14, fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.nameColor, textTransform: "uppercase", fontWeight: "bold"
                }}>
                    {
                        currentContent?.name
                    }
                </Text>
                <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 1 }}>
                    <Text style={{
                        textAlign: "center", fontWeight: "bold", fontSize: 14, paddingTop: 4, paddingBottom: 4, paddingLeft: 6, paddingRight: 6,
                        color: theme.themes[theme.name].menu.draftOrder.item.price.textColor
                    }}>
                        {
                            position.getFormatedSumPerOne(true)
                        }
                    </Text>
                </View>
            </TouchableOpacity>
            <NumericStapper
                value={position.quantity}
                buttonStyle={{
                    width: 32, height: 32, borderRadius: 10,
                    backgroundColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.backgroundColor,
                    borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.borderColor,
                    padding: 6
                }}
                disabledButtonStyle={{
                    width: 32, height: 32, borderRadius: 10,
                    backgroundColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledBackgroundColor,
                    borderColor: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledBorderColor,
                    padding: 6
                }}
                buttonTextStyle={{
                    fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.textColor as any,
                }}
                disabledButtonTextStyle={{
                    fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.buttons.disabledTextColor as any,
                }}
                textStyle={{
                    width: 44,
                    fontSize: 14, fontWeight: "bold",
                    color: theme.themes[theme.name].menu.draftOrder.item.quantityStepper.indicator.textColor
                }}
                iconDecrement="-"
                iconIncrement="+"
                min={0}
                max={Math.min(position.rests, 99)}
                onChange={changeQuantityHandler}
            />
        </View>
    );
})