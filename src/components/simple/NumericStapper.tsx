import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { uiutils } from "../../utils/ui";

interface INumericStepperButtonProps {
    icon: string;
    onPress: () => void;
    disabled?: boolean;
    selected?: boolean;
    style: StyleProp<ViewStyle>;
    selectedStyle?: StyleProp<ViewStyle>;
    disabledStyle: StyleProp<ViewStyle>;
    disabledSelectedStyle?: StyleProp<ViewStyle>;
    textStyle: StyleProp<TextStyle>;
    textSelectedStyle?: StyleProp<TextStyle>;
    disabledTextStyle: StyleProp<TextStyle>;
    disabledSelectedTextStyle?: StyleProp<TextStyle>;
}

const NumericStepperButton = ({ icon, style, selectedStyle, textStyle, textSelectedStyle, disabled, selected,
    disabledStyle, disabledSelectedStyle, disabledTextStyle, disabledSelectedTextStyle, onPress }: INumericStepperButtonProps) => {

    const actualStyle = disabled ?
        selected && disabledSelectedStyle ?
            disabledSelectedStyle :
            disabledStyle :
        selected && selectedStyle ?
            selectedStyle :
            style;

    const actualTextStyle = disabled ?
        selected && disabledSelectedTextStyle ?
            disabledSelectedTextStyle :
            disabledTextStyle :
        selected && textSelectedStyle ?
            textSelectedStyle :
            textStyle;

    const shadow = uiutils.createShadow((actualStyle as any)?.backgroundColor);

    return (
        <DropShadow style={shadow}>
            <TouchableOpacity onPress={onPress}>
                <View style={{ alignItems: "center", justifyContent: "center", ...actualStyle as any }}>
                    <Text style={{ ...actualTextStyle as any }}>
                        {
                            icon
                        }
                    </Text>
                </View>
            </TouchableOpacity>
        </DropShadow>
    );
};

interface INumericStapperProps {
    onChange: (value: number) => void;
    value?: number;
    formatValueFunction?: (value: number) => string;
    textStyle?: StyleProp<TextStyle>;
    textSelectedStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonSelectedStyle?: StyleProp<ViewStyle | TextStyle>;
    disabledButtonStyle?: StyleProp<ViewStyle | TextStyle>;
    disabledSelectedButtonStyle?: StyleProp<ViewStyle | TextStyle>;
    buttonTextStyle: StyleProp<TextStyle>;
    buttonSelectedTextStyle?: StyleProp<TextStyle>;
    disabledButtonTextStyle?: StyleProp<TextStyle>;
    disabledSelectedButtonTextStyle?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    iconDecrement?: string;
    iconIncrement?: string;
    min?: number;
    max?: number;
}

export const NumericStapper = React.memo(({ value = 0, iconDecrement = "-", iconIncrement = "+",
    buttonStyle, buttonSelectedStyle, disabledButtonStyle, disabledSelectedButtonStyle, disabledButtonTextStyle,
    disabledSelectedButtonTextStyle, buttonTextStyle, buttonSelectedTextStyle,
    containerStyle, textStyle, min, max, formatValueFunction, onChange }: INumericStapperProps) => {
    const [isDecDisabled, setIsDecDisabled] = useState(value === min);
    const [isIncDisabled, setIsIncDisabled] = useState(value === max);

    const setValue = (value: number) => {
        onChange(value);
    }

    useEffect(() => {
        setIsDecDisabled(value === min);
        setIsIncDisabled(value === max);
    }, [min, max, value]);

    const decrementHandler = useCallback(() => {
        if (min === undefined || value > min) {
            setValue(value - 1);
        }
    }, [value, min]);

    const incrementHandler = useCallback(() => {
        if (max === undefined || value < max) {
            setValue(value + 1);
        }
    }, [value, max]);

    return (
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", ...containerStyle as any }}>
            <NumericStepperButton disabled={isDecDisabled} selected={value > 0} style={buttonStyle} selectedStyle={buttonSelectedStyle}
                disabledStyle={disabledButtonStyle} disabledSelectedStyle={disabledSelectedButtonStyle}
                textStyle={buttonTextStyle} textSelectedStyle={buttonSelectedTextStyle}
                disabledTextStyle={disabledButtonTextStyle} disabledSelectedTextStyle={disabledSelectedButtonTextStyle}
                icon={iconDecrement} onPress={decrementHandler} />
            <Text style={{ flex: 1, textAlign: "center", ...textStyle as any }}>
                {
                    !!formatValueFunction
                        ? formatValueFunction(value)
                        : value.toString()
                }
            </Text>
            <NumericStepperButton disabled={isIncDisabled} selected={value > 0} style={buttonStyle} selectedStyle={buttonSelectedStyle}
                disabledStyle={disabledButtonStyle} disabledSelectedStyle={disabledSelectedButtonStyle}
                textStyle={buttonTextStyle} textSelectedStyle={buttonSelectedTextStyle}
                disabledTextStyle={disabledButtonTextStyle} disabledSelectedTextStyle={disabledSelectedButtonTextStyle}
                icon={iconIncrement} onPress={incrementHandler} />
        </View>
    );
})