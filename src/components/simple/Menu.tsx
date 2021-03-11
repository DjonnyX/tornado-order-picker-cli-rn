import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Animated, Easing } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
    NodeTypes, ICompiledLanguage, ICompiledOrderType, ICurrency,
} from "@djonnyx/tornado-types";
import { SideMenu } from "./side-menu";
import { NavMenu } from "./nav-menu";
import { MenuButton } from "./MenuButton";
import { CtrlMenuButton } from "./CtrlMenuButton";
import { theme } from "../../theme";
import { ModifiersEditor } from "./modifiers";
import { MenuNode } from "../../core/menu/MenuNode";

interface IMenuProps {
    menuStateId: number;
    orderType: ICompiledOrderType;
    menu: MenuNode;
    currency: ICurrency;
    language: ICompiledLanguage;
    width: number;
    height: number;

    cancelOrder: () => void;
    addPosition: (productNode: MenuNode) => void;
}

const sideMenuWidth = 180;

export const Menu = React.memo(({
    menu, menuStateId, orderType, language, currency, width, height,
    cancelOrder, addPosition,
}: IMenuProps) => {
    const [currentCategory, setCurrentCategory] = useState<MenuNode>(menu);
    const [previousCategory, setPreviousCategory] = useState<MenuNode>(menu);
    const [menuPosition, setMenuPosition] = useState(new Animated.Value(1));
    const [screenPosition, setScreenPosition] = useState(new Animated.Value(0));
    const [navMenuWidth, setNavMenuWidth] = useState(width);
    let menuAnimation: Animated.CompositeAnimation;
    let screenAnimation: Animated.CompositeAnimation;

    useEffect(() => {
        if (currentCategory.__rawNode__.id !== previousCategory.__rawNode__.id) {
            if (currentCategory.index > previousCategory.index) {
                screenFadeOut();
            } else {
                screenFadeIn();
            }

            if (currentCategory.id === menu.id) {
                sideMenuFadeOut();
            } else {
                sideMenuFadeIn();
            }
        }
    }, [currentCategory, previousCategory]);

    const setSelectedCategory = useCallback((category: MenuNode) => {
        setCurrentCategory(prev => {
            setPreviousCategory(prev);
            return category;
        });
    }, [currentCategory, menuStateId]);

    const selectSideMenuCategoryHandler = useCallback((node: MenuNode) => {
        navigateTo(node);
    }, [menuStateId]);

    const selectNavMenuCategoryHandler = useCallback((node: MenuNode) => {
        navigateTo(node);
    }, [menuStateId]);

    // Сброс на первую активную группу, при изменении бизнесс-периода
    useEffect(() => {
        const activeChildren = menu.activeChildren;
        const activeItem = activeChildren.find(node => node.__rawNode__.id === currentCategory.__rawNode__.id);
        if (!!activeItem) {
            navigateTo(activeItem);
        } else if (currentCategory.__rawNode__.id === menu.__rawNode__.id) {
            navigateTo(menu);
        } else {
            const node = activeChildren.length > 0 ? activeChildren[0] : menu;
            navigateTo(node);
        }
    }, [menuStateId]);

    // навигация / добавление продукта
    const navigateTo = useCallback((node: MenuNode) => {
        if (node.type === NodeTypes.SELECTOR || node.type === NodeTypes.SELECTOR_NODE) {

            // навигация по категории
            setSelectedCategory(node);
        } else if (node.type === NodeTypes.PRODUCT) {
            const productNode = node;

            // добавление позиции
            addPosition(productNode);
        }
    }, []);

    // возврат к предидущей категории
    const onBack = useCallback(() => {
        setSelectedCategory(currentCategory.parent || menu);
    }, [currentCategory, previousCategory]);

    // анимация скрытия бокового меню
    const sideMenuFadeOut = useCallback(() => {
        setNavMenuWidth(width);

        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    }, []);

    // анимация отображения бокового меню
    const sideMenuFadeIn = useCallback(() => {
        setNavMenuWidth(width - sideMenuWidth)

        if (menuAnimation) {
            menuAnimation.stop();
        }
        menuAnimation = Animated.timing(menuPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        menuAnimation.start();
    }, []);

    // анимация скрытия бокового меню
    const screenFadeOut = useCallback(() => {
        if (screenAnimation) {
            screenAnimation.stop();
        }
        screenPosition.setValue(1);
        screenAnimation = Animated.timing(screenPosition, {
            useNativeDriver: false,
            toValue: 0,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        screenAnimation.start();
    }, []);

    // анимация отображения бокового меню
    const screenFadeIn = useCallback(() => {
        if (screenAnimation) {
            screenAnimation.stop();
        }
        screenPosition.setValue(0);
        screenAnimation = Animated.timing(screenPosition, {
            useNativeDriver: false,
            toValue: 1,
            duration: 250,
            easing: Easing.cubic,
            delay: 10,
        });
        screenAnimation.start();
    }, []);

    return (
        <>
            <ModifiersEditor></ModifiersEditor>
            <View style={{ flex: 1, width, height: "100%" }}>
                <LinearGradient
                    colors={theme.themes[theme.name].menu.header.background}
                    style={{ display: "flex", position: "absolute", width: "100%", height: 96, zIndex: 1 }}
                >
                    <View style={{ display: "flex", alignItems: "center", flexDirection: "row", width: "100%", height: "100%", padding: 16 }}>
                        <Animated.View style={{
                            width: 162,
                            justifyContent: "center",
                            alignItems: "center",
                            top: 10,
                            left: menuPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-10, -sideMenuWidth],
                            }),
                        }}>
                            <MenuButton onPress={onBack}></MenuButton>
                        </Animated.View>
                        <View style={{ flex: 1 }}></View>
                        <Text style={{
                            textTransform: "uppercase", fontWeight: "bold",
                            color: theme.themes[theme.name].menu.header.titleColor,
                            fontSize: 32, marginRight: 24
                        }}>
                            {
                                currentCategory.__rawNode__.content?.contents[language.code]?.name || "Меню"
                            }
                        </Text>
                    </View>
                </LinearGradient>
                <View style={{ position: "absolute", overflow: "hidden", flexDirection: "row", width: "100%", height: "100%" }}>
                    <Animated.View style={{
                        position: "absolute",
                        width: sideMenuWidth,
                        height: "100%",
                        marginTop: 48,
                        left: menuPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -sideMenuWidth],
                        }),
                    }}>
                        <View style={{ flex: 1, flexGrow: 1, margin: "auto" }}>
                            <SideMenu menu={menu} language={language} selected={currentCategory}
                                onPress={selectSideMenuCategoryHandler}></SideMenu>
                        </View>
                        <View style={{ flex: 0, width: "100%", height: 192, margin: "auto", padding: 24 }}>
                            <CtrlMenuButton
                                gradient={theme.themes[theme.name].menu.ctrls.cancelButton.backgroundColor}
                                gradientDisabled={theme.themes[theme.name].menu.ctrls.cancelButton.disabledBackgroundColor}
                                text="Отменить" onPress={cancelOrder} />
                        </View>
                    </Animated.View>
                    <Animated.View style={{
                        position: "absolute",
                        height: "100%",
                        zIndex: 0,
                        left: menuPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [sideMenuWidth, 0],
                        }),
                        width: menuPosition.interpolate({
                            inputRange: [0, 1],
                            outputRange: [width - sideMenuWidth, width],
                            easing: Easing.linear,
                        }),
                    }}>

                        <Animated.View style={{
                            position: "absolute",
                            height: "100%",
                            width: navMenuWidth,
                            top: screenPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, height],
                            }),
                        }}>
                            <NavMenu menuStateId={menuStateId} orderType={orderType}
                                node={previousCategory.index <= currentCategory.index ? currentCategory : previousCategory}
                                language={language} currency={currency} onPress={selectNavMenuCategoryHandler}></NavMenu>
                        </Animated.View>

                        <Animated.View style={{
                            position: "absolute",
                            height: "100%",
                            width: navMenuWidth,
                            top: screenPosition.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-height, 0],
                            }),
                        }}>
                            <NavMenu menuStateId={menuStateId} orderType={orderType}
                                node={previousCategory.index > currentCategory.index ? currentCategory : previousCategory}
                                language={language} currency={currency} onPress={selectNavMenuCategoryHandler}></NavMenu>
                        </Animated.View>
                    </Animated.View>
                </View>
            </View >
        </>
    )
})