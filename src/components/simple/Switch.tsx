import React, { useCallback, useEffect, useState } from "react";
import { View, TouchableOpacity, StyleProp, ViewStyle, TextStyle, Text, Animated, Easing, LayoutChangeEvent } from "react-native";
import DropShadow from "react-native-drop-shadow";
import { uiutils } from "../../utils/ui";

interface ISwitchProps {
    titleOn: string;
    titleOff: string;
    disabled?: boolean;
    styleViewOn?: StyleProp<ViewStyle>;
    styleViewOnDisabled?: StyleProp<ViewStyle>;
    styleOn?: StyleProp<ViewStyle>;
    styleOnDisabled?: StyleProp<ViewStyle>;
    styleViewOff?: StyleProp<ViewStyle>;
    styleViewOffDisabled?: StyleProp<ViewStyle>;
    styleOff?: StyleProp<ViewStyle>;
    styleOffDisabled?: StyleProp<ViewStyle>;
    textStyleOn?: StyleProp<TextStyle>;
    textStyleOnDisabled?: StyleProp<TextStyle>;
    textStyleOff?: StyleProp<TextStyle>;
    textStyleOffDisabled?: StyleProp<TextStyle>;
    value: boolean;
    onChange: (value: boolean) => void;
    formatValueFunction?: (value: boolean) => string;
}

interface IStyles {
    sViewOn: StyleProp<ViewStyle>;
    sLayoutOn: StyleProp<ViewStyle>;
    sTextOn: StyleProp<TextStyle>;
    sViewOff: StyleProp<ViewStyle>;
    sLayoutOff: StyleProp<ViewStyle>;
    sTextOff: StyleProp<TextStyle>;
}

export const Switch = React.memo(({ value, titleOn, titleOff,
    styleOn, styleOnDisabled, styleViewOn, styleViewOnDisabled, textStyleOn, textStyleOnDisabled,
    styleOff, styleOffDisabled, styleViewOff, styleViewOffDisabled, textStyleOff, textStyleOffDisabled,
    disabled = false, onChange, formatValueFunction }: ISwitchProps) => {
    const [styles, setStyles] = useState<IStyles>({} as IStyles);
    const [width, setWidth] = useState<number>(0);
    const [position, setPosition] = useState(new Animated.Value(Number(value)));
    //const shadow = uiutils.createShadow((style as any)?.backgroundColor);
    let animation: Animated.CompositeAnimation;

    useEffect(() => {
        let sViewOn: StyleProp<ViewStyle> = { flex: 1, borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleViewOn as any };
        let sLayoutOn: StyleProp<ViewStyle> = { flex: 1, flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 22, paddingVertical: 16, ...styleOn as any };
        let sTextOn: StyleProp<TextStyle> = { fontSize: 14, fontWeight: "bold", ...textStyleOn as any };

        let sViewOff: StyleProp<ViewStyle> = { flex: 1, borderRadius: 3, overflow: "hidden", opacity: disabled ? 0.35 : 1, ...styleViewOff as any };
        let sLayoutOff: StyleProp<ViewStyle> = { flex: 1, flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 22, paddingVertical: 16, ...styleOff as any };
        let sTextOff: StyleProp<TextStyle> = { fontSize: 14, fontWeight: "bold", ...textStyleOff as any };

        if (disabled) {
            if (!!styleViewOnDisabled) {
                sViewOn = { ...sViewOn as any, ...styleViewOnDisabled as any };
            }
            if (!!styleOnDisabled) {
                sLayoutOn = { ...sLayoutOn as any, ...styleOnDisabled as any };
            }
            if (!!textStyleOnDisabled) {
                sTextOn = { ...sTextOn as any, ...textStyleOnDisabled as any };
            }

            if (!!styleViewOffDisabled) {
                sViewOff = { ...sViewOff as any, ...styleViewOffDisabled as any };
            }
            if (!!styleOffDisabled) {
                sLayoutOff = { ...sLayoutOn as any, ...styleOffDisabled as any };
            }
            if (!!textStyleOnDisabled) {
                sTextOff = { ...sTextOff as any, ...textStyleOffDisabled as any };
            }
        }

        setStyles({
            sViewOn,
            sLayoutOn,
            sTextOn,
            sViewOff,
            sLayoutOff,
            sTextOff,
        });
    }, [disabled]);

    useEffect(() => {
        if (!value) {
            animationTurnOff();
        } else {
            animationTurnOn();
        }
    }, [value]);

    const animationTurnOff = useCallback(() => {
        if (animation) {
            animation.stop();
        }
        animation = Animated.timing(position, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        animation.start();
    }, []);

    // анимация отображения бокового меню
    const animationTurnOn = useCallback(() => {
        if (animation) {
            animation.stop();
        }
        animation = Animated.timing(position, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        animation.start();
    }, []);

    const onChangeHandler = () => {
        if (!disabled) {
            onChange(!value);
        }
    };

    const onChangeLayout = useCallback((event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setWidth(width);
    }, []);

    //<DropShadow style={shadow}>

    return (
        <View onLayout={onChangeLayout} style={{ width: "100%", overflow: "hidden" }}>
            <Animated.View style={{
                width: width * 2,
                flexDirection: "row",
                left: position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -width],
                }),
            }}>
                <TouchableOpacity style={styles.sViewOff} onPress={() => { onChangeHandler() }} disabled={disabled}>
                    <View
                        style={styles.sLayoutOff}
                    >
                        <Text style={styles.sTextOff}>
                            {
                                titleOff
                            }
                        </Text>
                        {
                            !!formatValueFunction &&
                            <Text style={styles.sTextOff}>
                                {
                                    formatValueFunction(value)
                                }
                            </Text>
                        }
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.sViewOn} onPress={() => { onChangeHandler() }} disabled={disabled}>
                    <View
                        style={styles.sLayoutOn}
                    >
                        <Text style={styles.sTextOn}>
                            {
                                titleOn
                            }
                        </Text>
                        {
                            !!formatValueFunction &&
                            <Text style={styles.sTextOn}>
                                {
                                    formatValueFunction(value)
                                }
                            </Text>
                        }
                    </View>
                </TouchableOpacity>
            </Animated.View>
        </View>
    )
});