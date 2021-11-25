import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text } from "react-native";

interface ISimpleButtonProps {
    title: string;
    disabled?: boolean;
    styleView?: StyleProp<ViewStyle>;
    styleViewDisabled?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    styleDisabled?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    textStyleDisabled?: StyleProp<TextStyle>;
    onPress: () => void;
    children?: JSX.Element;
}

interface IStyles {
    sView: StyleProp<ViewStyle>;
    sLayout: StyleProp<ViewStyle>;
    sText: StyleProp<TextStyle>;
}

export const SimpleButton = React.memo(({ children, title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled,
    disabled = false, onPress }: ISimpleButtonProps) => {
    const [styles, setStyles] = useState<IStyles>({} as IStyles);

    useEffect(() => {
        let sView: StyleProp<ViewStyle> = { borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleView as any };
        let sLayout: StyleProp<ViewStyle> = { flexDirection: "row", alignItems: "center", paddingHorizontal: 22, paddingVertical: 16, ...style as any };
        let sText: StyleProp<TextStyle> = { fontSize: 14, fontWeight: "600", ...textStyle as any };

        if (disabled) {
            if (!!styleViewDisabled) {
                sView = { ...sView as any, ...styleViewDisabled as any };
            }
            if (!!styleDisabled) {
                sLayout = { ...sLayout as any, ...styleDisabled as any };
            }
            if (!!textStyleDisabled) {
                sText = { ...sText as any, ...textStyleDisabled as any };
            }
        }

        setStyles({
            sView,
            sLayout,
            sText,
        })
    }, [style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled, disabled]);

    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled, title]);

    return (
        <TouchableOpacity style={styles.sView} onPress={onPressHandler} disabled={disabled}>
            <View
                style={styles.sLayout}
            >
                {
                    !!children && children
                }
                <Text style={styles.sText}>
                    {
                        title
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
});

interface ISimpleSysytemButtonProps {
    title: string;
    disabled?: boolean;
    styleView?: StyleProp<ViewStyle>;
    styleViewDisabled?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    styleDisabled?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    textStyleDisabled?: StyleProp<TextStyle>;
    onPress: () => void;
}

export const SimpleSystemButton = React.memo(({ title, style, styleDisabled, textStyle, textStyleDisabled, styleView, styleViewDisabled,
    disabled = false, onPress }: ISimpleSysytemButtonProps) => {

    let sView: StyleProp<ViewStyle> = { borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleView as any };
    let sLayout: StyleProp<ViewStyle> = { paddingLeft: 22, paddingRight: 22, paddingTop: 16, paddingBottom: 16, ...style as any };
    let sText: StyleProp<TextStyle> = { fontSize: 14, fontWeight: "600", ...textStyle as any };

    if (disabled) {
        if (!!styleViewDisabled) {
            sView = { ...sView as any, ...styleViewDisabled as any };
        }
        if (!!styleDisabled) {
            sLayout = { ...sLayout as any, ...styleDisabled as any };
        }
        if (!!textStyleDisabled) {
            sText = { ...sText as any, ...textStyleDisabled as any };
        }
    }

    const styles: IStyles = {
        sView,
        sLayout,
        sText,
    };

    const onPressHandler = useCallback(() => {
        if (!disabled) {
            onPress();
        }
    }, [disabled, title]);

    return (
        <TouchableOpacity style={styles.sView} onPress={onPressHandler} disabled={disabled}>
            <View
                style={styles.sLayout}
            >
                <Text style={styles.sText}>
                    {
                        title
                    }
                </Text>
            </View>
        </TouchableOpacity>
    )
});