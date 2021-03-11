import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Icons, theme } from "../../theme";

interface IMenuButtonProps {
    onPress: () => void;
}

export const MenuButton = ({ onPress }: IMenuButtonProps) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={{ padding: 18, borderRadius: 16 }}
            >
                <Icons name="ArrLeft" fill={theme.themes[theme.name].menu.backButton.iconColor} width={44} height={44} ></Icons>
            </View>
        </TouchableOpacity>
    )
}