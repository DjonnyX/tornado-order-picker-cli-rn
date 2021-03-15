import { ICompiledOrder, ICompiledOrderPosition, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";
import React, { useCallback } from "react";
import { Text, TouchableOpacity, FlatList, View } from "react-native";
import { Icons, theme } from "../../../theme";
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
}

interface IStatusPickerProps {
    data: IStatusPickerData | undefined;
    onSelect: (order: ICompiledOrder, position: ICompiledOrderPosition | undefined, status: OrderStatuses | OrderPositionStatuses) => void;
    onClose: () => void;
}

export const StatusPicker = React.memo(({ data, onSelect, onClose }: IStatusPickerProps) => {

    const onSelectHandler = useCallback((item: IStatusItem) => {
        if (!!data?.order) {
            onSelect(data?.order, data?.position, item.value);
        }
    }, [data]);

    return (
        <ModalRollTop visible={!!data?.statuses}>
            <View style={{ width: "100%", justifyContent: "flex-end" }}>
                <CloseButton onPress={onClose}></CloseButton>
            </View>
            <FlatList style={{ flexGrow: 0, padding: 12 }} data={data?.statuses} renderItem={({ item }) => {
                return <TouchableOpacity style={{ backgroundColor: item.color, borderRadius: 8, padding: 12 }} onPress={() => {
                    onSelectHandler(item);
                }}>
                    <Text style={{
                        fontSize: 16, fontWeight: "bold",
                        color: item.textColor,
                    }}>
                        {
                            item.name
                        }
                    </Text>
                </TouchableOpacity>
            }}>
            </FlatList>
        </ModalRollTop>
    );
});

interface ICloseButtonProps {
    onPress: () => void;
}

const CloseButton = ({ onPress }: ICloseButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ borderRadius: 16 }}
            >
                <Icons name="Close" fill={theme.themes[theme.name].menu.backButton.iconColor} width={34} height={34} ></Icons>
            </View>
        </TouchableOpacity>
    )
}