import { ICompiledOrder, ICompiledOrderPosition, IOrderPickerThemeColors, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";
import React, { useCallback } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import { IActionHandler } from "../../../interfaces";
import { Icons } from "../../../theme";
import { ModalRollTop } from "../ModalRollTop";

export interface IStatusItem {
    name: string;
    value: OrderStatuses | OrderPositionStatuses;
    color: string;
    textColor: string;
}

export interface IStatusPickerData {
    statuses: Array<IStatusItem> | undefined;
    order: ICompiledOrder;
    position: ICompiledOrderPosition | undefined;
    actionHandler: IActionHandler;
}

interface IStatusPickerProps {
    theme: IOrderPickerThemeColors;
    data: IStatusPickerData | undefined;
    onSelect: (order: ICompiledOrder, position: ICompiledOrderPosition | undefined, actionHandler: IActionHandler,
        status: OrderStatuses | OrderPositionStatuses) => void;
    onClose: () => void;
}

export const StatusPicker = React.memo(({ theme, data, onSelect, onClose }: IStatusPickerProps) => {
    const onSelectHandler = useCallback((item: IStatusItem) => {
        if (!!data?.order) {
            onSelect(data?.order, data?.position, data?.actionHandler, item.value);
        }
    }, [data]);

    return (
        <ModalRollTop theme={theme} visible={!!data?.statuses}>
            <View style={{ width: "100%", alignItems: "flex-end" }}>
                <CloseButton theme={theme} onPress={onClose}></CloseButton>
            </View>
            <View style={{ flex: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
                {
                    data?.statuses?.map(status => (
                        <TouchableHighlight style={{
                            backgroundColor: status.color, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 22,
                            width: "100%", maxWidth: 300, marginBottom: 4,
                        }} onPress={() => {
                            onSelectHandler(status);
                        }}>
                            <Text style={{
                                fontSize: 16, fontWeight: "bold",
                                color: status.textColor,
                                textShadowRadius: 2,
                                textShadowColor: "rgba(0,0,0,0.2)"
                            }}>
                                {
                                    status.name
                                }
                            </Text>
                        </TouchableHighlight>
                    ))
                }
            </View>
        </ModalRollTop>
    );
});

interface ICloseButtonProps {
    theme: IOrderPickerThemeColors;
    onPress: () => void;
}

const CloseButton = ({ theme, onPress }: ICloseButtonProps) => {
    return (
        <TouchableHighlight onPress={onPress}>
            <View
                style={{ borderRadius: 16, margin: 22 }}
            >
                <Icons name="Close" fill={theme.statusPicker.backButton.iconColor} width={34} height={34} ></Icons>
            </View>
        </TouchableHighlight>
    )
}