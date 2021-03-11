import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native";
import { ICurrency, ICompiledLanguage, ICompiledOrderType } from "@djonnyx/tornado-types";
import { NavMenuItem } from "./NavMenuItem";
import { ScrollView } from "react-native-gesture-handler";
import { GridList } from "../../layouts/GridList";
import { MenuNode } from "../../../core/menu/MenuNode";

interface INavMenuProps {
    menuStateId: number;
    orderType: ICompiledOrderType;
    node: MenuNode;
    currency: ICurrency;
    language: ICompiledLanguage;
    onPress: (node: MenuNode) => void;
}

export const NavMenu = React.memo(({ currency, language, node, orderType, menuStateId, onPress }: INavMenuProps) => {
    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <ScrollView style={{ flex: 1, marginTop: 68 }} horizontal={false}
            >
                <GridList style={{ flex: 1 }} disbleStartAnimation padding={10} spacing={6} data={node.activeChildren} itemDimension={196}
                    animationSkipFrames={10} renderItem={({ item }) => {
                        return <NavMenuItem key={item.id} stateId={item.stateId} node={item} currency={currency} language={language}
                            thumbnailHeight={128} onPress={onPress}></NavMenuItem>
                    }}
                    keyExtractor={(item, index) => item.id}>
                </GridList>
            </ScrollView>
        </SafeAreaView>
    );
});