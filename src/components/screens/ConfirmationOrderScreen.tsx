import React, { Dispatch, useCallback } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { connect } from "react-redux";
import { StackScreenProps } from "@react-navigation/stack";
import { ICompiledLanguage, ICompiledAd, ICurrency } from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CombinedDataSelectors, MyOrderSelectors } from "../../store/selectors";
import { CapabilitiesSelectors } from "../../store/selectors/CapabilitiesSelector";
import { Ads, SimpleButton } from "../simple";
import { theme } from "../../theme";
import { MyOrderActions, NotificationActions } from "../../store/actions";
import { ConfirmationOrderListItem } from "../simple/confirmation-order-list";
import { OrderWizard } from "../../core/order/OrderWizard";
import { IAlertState } from "../../interfaces";

interface IConfirmationOrderScreenSelfProps {
    // store props
    _confirmOrder: () => void;
    _alertOpen: (alert: IAlertState) => void;
    _orderStateId: number;
    _menuStateId: number;
    _banners: Array<ICompiledAd>;
    _language: ICompiledLanguage;
    _currency: ICurrency;

    // self props
}

interface IConfirmationOrderScreenProps extends StackScreenProps<any, MainNavigationScreenTypes.INTRO>, IConfirmationOrderScreenSelfProps { }

const ConfirmationOrderScreenContainer = React.memo(({ _language, _banners, _currency, _orderStateId, _menuStateId, navigation,
    _confirmOrder, _alertOpen }: IConfirmationOrderScreenProps) => {

    const selectAdHandler = useCallback((ad: ICompiledAd) => {
        // etc...
    }, []);

    const onNext = useCallback(() => {
        _confirmOrder();
    }, []);

    const onPrevious = useCallback(() => {
        navigation.navigate(MainNavigationScreenTypes.MENU);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: theme.themes[theme.name].confirmation.background }}>
            {
                _banners.length > 0
                    ?
                    <View style={{ display: "flex", height: "10%", width: "100%", minHeight: 144 }}>
                        <Ads ads={_banners} menuStateId={_menuStateId} language={_language} onPress={selectAdHandler} />
                    </View>
                    :
                    undefined
            }
            <View style={{ flex: 1, flexDirection: "column", width: "100%", height: "100%", maxHeight: _banners.length > 0 ? "90%" : "100%" }}>
                <View style={{ flex: 1 }}>
                    <SafeAreaView style={{ flex: 1, width: "100%" }}>
                        <FlatList updateCellsBatchingPeriod={10} style={{ flex: 1 }}
                            data={OrderWizard.current.positions} renderItem={({ item, index }) => {
                                return <ConfirmationOrderListItem key={item.id} stateId={item.stateId} position={item}
                                    color={index % 2 ? theme.themes[theme.name].confirmation.item.oddBackgroundColor : undefined}
                                    currency={_currency} language={_language} alertOpen={_alertOpen} />
                            }}
                            keyExtractor={(item, index) => index.toString()}>
                        </FlatList>
                    </SafeAreaView>
                </View>
                <View style={{ width: "100%", flexDirection: "row", paddingLeft: 24, paddingRight: 24, paddingTop: 28, paddingBottom: 28 }}>
                    <SimpleButton title="Назад"
                        styleView={{ opacity: 1, minWidth: 124 }}
                        style={{
                            backgroundColor: theme.themes[theme.name].confirmation.backButton.backgroundColor,
                            borderRadius: 16, padding: 20, height: 96, justifyContent: "center"
                        }}
                        textStyle={{
                            textAlign: "center", fontWeight: "bold",
                            color: theme.themes[theme.name].confirmation.backButton.textColor,
                            fontSize: 16, textTransform: "uppercase"
                        }}
                        onPress={onPrevious}></SimpleButton>
                    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
                        <Text style={{
                            fontSize: 34, fontWeight: "bold", color: theme.themes[theme.name].confirmation.summaryPrice.textColor,
                            textAlign: "center", textTransform: "uppercase"
                        }}>{
                                `Итого: ${OrderWizard.current.getFormatedSum(true)}`
                            }</Text>
                    </View>
                    <SimpleButton title="Далее"
                        styleView={{ opacity: 1, minWidth: 124 }}
                        style={{
                            backgroundColor: theme.themes[theme.name].confirmation.nextButton.backgroundColor,
                            borderRadius: 16, padding: 20, height: 96, justifyContent: "center"
                        }}
                        textStyle={{
                            textAlign: "center",
                            fontWeight: "bold", color: theme.themes[theme.name].confirmation.nextButton.textColor,
                            fontSize: 16, textTransform: "uppercase"
                        }}
                        onPress={onNext}></SimpleButton>
                </View>
            </View>
        </View>
    );
})

const mapStateToProps = (state: IAppState, ownProps: IConfirmationOrderScreenProps) => {
    return {
        _banners: CombinedDataSelectors.selectBanners(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
        _confirmOrder: () => {
            dispatch(MyOrderActions.isProcessing(true));
        },
    };
};

export const ConfirmationOrderScreen = connect(mapStateToProps, mapDispatchToProps)(ConfirmationOrderScreenContainer);