import React, { useState, useCallback } from "react";
import { View, LayoutChangeEvent, StyleProp, ViewStyle } from "react-native";

interface IGridListProps<T = any> {
    children?: never[];
    style?: StyleProp<ViewStyle>;
    padding?: number;
    data: Array<T>;
    itemDimension: number;
    spacing?: number;
    renderItem: (data: { item: T, index: number }) => JSX.Element;
    keyExtractor: (item: T, index: number) => number;
}

export const GridList = React.memo(({ data, renderItem, style, keyExtractor, spacing = 0, padding = 0,
    itemDimension }: IGridListProps) => {
    const [cellWidth, _setCellWidth] = useState(0);
    const [gap, _setGap] = useState(spacing * 0.5);

    const changeLayoutHandler = useCallback((event: LayoutChangeEvent) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        const numColumns = Math.floor(width / itemDimension);
        const gap = spacing * 0.5;
        const actualItemWidth = Math.floor(width - padding * 2 - numColumns * gap * 2) / numColumns
        _setCellWidth(actualItemWidth);
    }, []);

    return (
        <View
            style={{ width: "100%", height: "100%", ...style as any, padding }}
            onLayout={changeLayoutHandler}
        >
            <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                {
                    !!data && data.map((item, index) =>
                        <View key={(keyExtractor(item, index))}
                            style={{ width: cellWidth, margin: gap, justifyContent: "center", overflow: "hidden" }}>
                            {
                                renderItem({ item, index })
                            }
                        </View>
                    )
                }
            </View>
        </View>
    )
});