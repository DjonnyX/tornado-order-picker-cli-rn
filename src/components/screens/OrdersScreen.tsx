import React, { Dispatch, useCallback } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import {
    ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition, ICurrency,
    OrderPositionStatuses, OrderStatuses
} from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors, CombinedDataSelectors, OrdersSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { OrderListContainer } from "../simple/order-list/OrderList";
import { NotificationActions, OrdersActions } from "../../store/actions";
import { orderApiService } from "../../services";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { IAlertState } from "../../interfaces";

interface IOrdersSelfProps {
    // store props
    _orders: Array<ICompiledOrder>;
    _currency: ICurrency;
    _language: ICompiledLanguage;
    _onSetOrdersVersion: (version: number) => void;
    _onSetOrderStatus: (orderId: string, status: OrderStatuses) => void;
    _onSetOrderPositionStatus: (orderId: string, positionId: string, orderStatus: OrderStatuses, positionStatus: OrderPositionStatuses) => void;
    _alertOpen: (alert: IAlertState) => void;

    // self props
}

interface IOrdersProps extends StackScreenProps<any, MainNavigationScreenTypes.ORDERS>, IOrdersSelfProps { }

const getNextOrderStatus = (status: OrderStatuses): OrderStatuses => {
    switch (status) {
        case OrderStatuses.NEW: {
            return OrderStatuses.IN_PROCESS;
        }
        case OrderStatuses.IN_PROCESS: {
            return OrderStatuses.COMPLETE;
        }
    }

    return status;
}

const getNextOrderPositionStatus = (status: OrderPositionStatuses): OrderPositionStatuses => {
    switch (status) {
        case OrderPositionStatuses.NEW: {
            return OrderPositionStatuses.IN_PROCESS;
        }
        case OrderPositionStatuses.IN_PROCESS: {
            return OrderPositionStatuses.COMPLETE;
        }
    }

    return status;
}

const OrdersScreenContainer = React.memo(({ _orders, _language, _currency, navigation,
    _onSetOrdersVersion, _onSetOrderStatus, _onSetOrderPositionStatus, _alertOpen }: IOrdersProps) => {
    const onSelectOrderHandler = useCallback((order: ICompiledOrder) => {
        const unsubscribe$ = new Subject<void>();
        const status = getNextOrderStatus(order.status);
        // if (status !== order.status) {
            orderApiService.changeOrderStatus(order.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    _onSetOrdersVersion(data.meta.ref.version);
                    _onSetOrderStatus(order.id as string, status);
                },
                err => {
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Отмена",
                                action: () => { }
                            },
                            {
                                title: "Повторить",
                                action: () => {
                                    onSelectOrderHandler(order);
                                }
                            }
                        ]
                    });
                }
            );
        // }

        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, []);

    const onSelectOrderPositionHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition) => {
        const unsubscribe$ = new Subject<void>();
        const status = getNextOrderPositionStatus(position.status);
        if (status !== position.status) {
            orderApiService.changeOrderPositionStatus(order.id as string, position.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    _onSetOrdersVersion(data.meta.ref.version);
                    _onSetOrderPositionStatus(order.id as string, position.id as string, data.data.status, status);
                },
                err => {
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Отмена",
                                action: () => { }
                            },
                            {
                                title: "Повторить",
                                action: () => {
                                    onSelectOrderPositionHandler(order, position);
                                }
                            }
                        ]
                    });
                }
            );
        }

        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, []);

    return (
        <View style={{
            width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <OrderListContainer orders={_orders} currency={_currency} language={_language}
                onSelectOrder={onSelectOrderHandler} onSelectOrderPosition={onSelectOrderPositionHandler} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _orders: OrdersSelectors.selectCollection(state),
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onSetOrderStatus: (orderId: string, status: OrderStatuses) => {
            dispatch(OrdersActions.setOrderStatus(orderId, status));
        },
        _onSetOrderPositionStatus: (orderId: string, positionId: string, orderStatus: OrderStatuses, positionStatus: OrderPositionStatuses) => {
            dispatch(OrdersActions.setOrderPositionStatus(orderId, positionId, orderStatus, positionStatus));
        },
        _onSetOrdersVersion: (version: number) => {
            dispatch(OrdersActions.setVersion(version));
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const OrdersScreen = connect(mapStateToProps, mapDispatchToProps)(OrdersScreenContainer);