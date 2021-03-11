import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from "react-native-fast-image";
import { NodeTypes, ICompiledProduct, ICurrency, ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../../theme";
import { TagList } from "../TagList";
import { MenuNode } from "../../../core/menu/MenuNode";

interface INavMenuItemProps {
    thumbnailHeight: number;
    node: MenuNode;
    stateId: number;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: MenuNode) => void;
}

export const NavMenuItem = React.memo(({ thumbnailHeight, currency, language, node, stateId,
    onPress }: INavMenuItemProps) => {

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(node);
        }
    }, []);

    const currentContent = node.__rawNode__.content?.contents[language?.code];
    const currentAdAsset = currentContent?.resources?.icon;

    const tags = node.type === NodeTypes.PRODUCT && (node.__rawNode__.content as ICompiledProduct).tags?.length > 0
        ? (node.__rawNode__.content as ICompiledProduct).tags
        : undefined;

    return (
        <View style={{
            flex: 1, backgroundColor: theme.themes[theme.name].menu.navMenu.item.backgroundColor,
            borderRadius: 16, padding: 22
        }}>
            <TouchableOpacity style={{ alignItems: "center", flex: 1 }} onPress={pressHandler}>
                <View style={{ alignItems: "center", flex: 1, width: "100%" }}>
                    <View style={{
                        flexDirection: "row", alignItems: "baseline", justifyContent: !!tags ? "space-around" : "flex-end",
                        width: "100%"
                    }}>
                        {
                            !!tags &&
                            <View style={{ flex: 1 }}>
                                <TagList tags={tags} language={language} />
                            </View>
                        }
                        {
                            node.type === NodeTypes.PRODUCT && node.discount < 0 &&
                            <View style={{
                                width: "auto"
                            }}>
                                <Text style={{
                                    borderRadius: 8,
                                    paddingHorizontal: 8,
                                    paddingVertical: 4,
                                    backgroundColor: "red",
                                    fontSize: 12, fontWeight: "bold",
                                    color: "white", //theme.themes[theme.name].menu.navMenu.item.price.textColor
                                }}>
                                    {
                                        node.getFormatedDiscount(true)
                                    }
                                </Text>
                            </View>
                        }
                    </View>
                    <View style={{ width: "100%", height: thumbnailHeight, marginBottom: 5 }}>
                        <FastImage style={{ width: "100%", height: "100%" }} source={{
                            uri: `file://${currentAdAsset?.mipmap.x128}`,
                        }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                    </View>
                    <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                        textAlign: "center", fontSize: 20, marginBottom: 6, fontWeight: "bold", textTransform: "uppercase",
                        color: theme.themes[theme.name].menu.navMenu.item.nameColor,
                    }}>
                        {
                            currentContent.name
                        }
                    </Text>
                    <Text textBreakStrategy="simple" numberOfLines={2} ellipsizeMode="tail" style={{
                        textAlign: "center",
                        fontSize: 12, color: theme.themes[theme.name].menu.navMenu.item.descriptionColor, textTransform: "uppercase",
                        marginBottom: 12
                    }}>
                        {
                            currentContent.description
                        }
                    </Text>
                </View>
                {
                    node.type === NodeTypes.PRODUCT
                        ?
                        <View style={{
                            borderStyle: "solid", borderWidth: 0.5, borderRadius: 5, alignItems: "center",
                            justifyContent: "center", borderColor: theme.themes[theme.name].menu.navMenu.item.price.borderColor,
                            marginBottom: 12
                        }}>
                            <Text style={{
                                textAlign: "center", fontSize: 16, paddingTop: 6, paddingBottom: 6, paddingLeft: 14,
                                paddingRight: 14, color: theme.themes[theme.name].menu.navMenu.item.price.textColor
                            }}>
                                {
                                    node.getFormatedPrice(true)
                                }
                            </Text>
                        </View>
                        :
                        undefined
                }
            </TouchableOpacity>
        </View>
    );
});