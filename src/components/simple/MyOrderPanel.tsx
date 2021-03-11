import React from "react";
import { View, Text } from "react-native";
import { LanguagePicker } from "./LanguagePicker";
import { ICompiledLanguage, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import { OrderTypesPicker } from "./OrderTypesPicker";
import { MyOrderList } from "./my-order-list";
import { CtrlMenuButton } from "./CtrlMenuButton";
import { theme } from "../../theme";
import { OrderWizard } from "../../core/order/OrderWizard";

interface IMyOrderPanelProps {
    orderStateId: number;
    currency: ICurrency;
    language: ICompiledLanguage;
    languages: Array<ICompiledLanguage>;
    orderType: ICompiledOrderType;
    orderTypes: Array<ICompiledOrderType>;
    isShowOrderTypes: boolean;

    onChangeLanguage: (lang: ICompiledLanguage) => void;
    onChangeOrderType: (orderType: ICompiledOrderType) => void;
    onConfirm: () => void;
}

export const MyOrderPanel = React.memo(({ orderStateId, currency, language, languages, orderType, orderTypes,
    isShowOrderTypes, onChangeLanguage, onChangeOrderType, onConfirm,
}: IMyOrderPanelProps) => {
    return (
        <View
            style={{ flex: 1, backgroundColor: theme.themes[theme.name].menu.orderPanel.backgroundColor }}
        >
            <View style={{ padding: 16, alignItems: "center" }}>
                <View style={{ margin: "auto", marginTop: 12, marginBottom: 12, alignItems: "center" }}>
                    <LanguagePicker language={language} languages={languages} onSelect={onChangeLanguage}></LanguagePicker>
                </View>
                {
                    !!orderTypes && orderTypes.length > 0 &&
                    <View style={{ margin: "auto", marginBottom: 12, alignItems: "center" }}>
                        <OrderTypesPicker isShow={isShowOrderTypes} language={language} orderType={orderType}
                            orderTypes={orderTypes} onSelect={onChangeOrderType}
                            style={{
                                backgroundColor: theme.themes[theme.name].orderTypePicker.backgroundColor,
                                borderColor: theme.themes[theme.name].orderTypePicker.borderColor
                            }}
                            textStyle={{ color: theme.themes[theme.name].orderTypePicker.textColor }} />
                    </View>
                }
                <View style={{ margin: "auto", marginBottom: 20, alignItems: "center" }}>
                    <Text style={{
                        textTransform: "uppercase", fontWeight: "bold", fontSize: 18,
                        color: theme.themes[theme.name].menu.sum.description.textColor
                    }}>
                        Итого
                    </Text>
                    <Text style={{ fontWeight: "bold", fontSize: 18, color: theme.themes[theme.name].menu.sum.price.textColor }}>
                        {
                            OrderWizard.current.getFormatedSum(true)
                        }
                    </Text>
                </View>
            </View>
            <View style={{ flex: 1, flexGrow: 1, margin: "auto" }}>
                <MyOrderList />
            </View>
            <View style={{ flex: 0, height: 144, margin: "auto", padding: 24 }}>
                <CtrlMenuButton text="Заказать" disabled={OrderWizard.current.positions.length === 0}
                    gradient={theme.themes[theme.name].menu.ctrls.confirmButton.backgroundColor}
                    gradientDisabled={theme.themes[theme.name].menu.ctrls.confirmButton.disabledBackgroundColor}
                    onPress={onConfirm}></CtrlMenuButton>
            </View>
        </View>
    )
})