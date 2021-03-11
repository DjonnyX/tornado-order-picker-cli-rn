import React, { useRef, useCallback, Dispatch } from "react";
import { SafeAreaView } from "react-native";
import { ICompiledLanguage, ICurrency } from "@djonnyx/tornado-types";
import { FlatList } from "react-native-gesture-handler";
import { MyOrderListItem } from "./MyOrderListItem";
import { CapabilitiesSelectors, CombinedDataSelectors, MenuSelectors, MyOrderSelectors } from "../../../store/selectors";
import { IAppState } from "../../../store/state";
import { connect } from "react-redux";
import { OrderWizard } from "../../../core/order/OrderWizard";
import { IAlertState } from "../../../interfaces";
import { NotificationActions } from "../../../store/actions";
import { IPositionWizard } from "../../../core/interfaces";

interface IMyOrderListProps {
    // store
    _currency?: ICurrency;
    _language?: ICompiledLanguage;
    _orderStateId?: number;
    _menuStateId?: number;
    _alertOpen?: (alert: IAlertState) => void;
}

export const MyOrderListContainer = React.memo(({ _currency, _language, _alertOpen, _orderStateId, _menuStateId }: IMyOrderListProps) => {
    const flatListRef = useRef<FlatList<IPositionWizard>>();

    const contentSizeChangeHandler = useCallback(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [flatListRef]);

    return (
        <SafeAreaView style={{ flex: 1, width: "100%" }}>
            <FlatList ref={flatListRef as any} onContentSizeChange={contentSizeChangeHandler} persistentScrollbar
                updateCellsBatchingPeriod={10} style={{ flex: 1 }} data={OrderWizard.current.positions} renderItem={({ item }) => {
                    return <MyOrderListItem key={item.id} position={item} currency={_currency as ICurrency}
                        language={_language as ICompiledLanguage} imageHeight={48} stateId={item.stateId} menuStateId={_menuStateId as number}
                        alertOpen={_alertOpen as any} />
                }}
                keyExtractor={(item, index) => index.toString()}>
            </FlatList>
        </SafeAreaView>
    )
})

const mapStateToProps = (state: IAppState, ownProps: IMyOrderListProps) => {
    return {
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _menuStateId: MenuSelectors.selectStateId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const MyOrderList = connect(mapStateToProps, mapDispatchToProps)(MyOrderListContainer);