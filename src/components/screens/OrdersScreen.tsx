import React, { Dispatch, useCallback, useState } from "react";
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
import { IStatusItem, IStatusPickerData, StatusPicker } from "../simple/status-selector/StatusPicker";

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

const getMinimumPositionsStatus = (positions: Array<ICompiledOrderPosition>): OrderPositionStatuses => {
    let minimumStatus: OrderPositionStatuses = OrderPositionStatuses.CANCELED;
    for (let i = 0, l = positions.length; i < l; i++) {
        const pos = positions[i];

        minimumStatus = Math.min(minimumStatus, pos.status, getMinimumPositionsStatus(pos.children));
    }

    return minimumStatus;
}

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

const ORDER_STATUS_LIST: Array<IStatusItem> = [
    {
        name: "Новый",
        value: OrderStatuses.NEW,
        color: "gray",
        textColor: "white",
    },
    {
        name: "Сборка",
        value: OrderStatuses.IN_PROCESS,
        color: "yellow",
        textColor: "black",
    },
    {
        name: "Готовый",
        value: OrderStatuses.COMPLETE,
        color: "green",
        textColor: "black",
    },
    {
        name: "Отменен",
        value: OrderStatuses.CANCELED,
        color: "2e2e2e",
        textColor: "red",
    }
];

const ORDER_POSITION_STATUS_LIST: Array<IStatusItem> = [
    {
        name: "Новый",
        value: OrderPositionStatuses.NEW,
        color: "gray",
        textColor: "white",
    },
    {
        name: "Сборка",
        value: OrderPositionStatuses.IN_PROCESS,
        color: "yellow",
        textColor: "black",
    },
    {
        name: "Готовый",
        value: OrderPositionStatuses.COMPLETE,
        color: "green",
        textColor: "black",
    },
    {
        name: "Отменен",
        value: OrderPositionStatuses.CANCELED,
        color: "2e2e2e",
        textColor: "red",
    }
];

const OrdersScreenContainer = React.memo(({ _orders, _language, _currency, navigation,
    _onSetOrdersVersion, _onSetOrderStatus, _onSetOrderPositionStatus, _alertOpen }: IOrdersProps) => {
    const [selectStatusData, setSelectStatusData] = useState<IStatusPickerData | undefined>(undefined);

    const onCloseSelectStatusHandler = useCallback(() => {
        setSelectStatusData(undefined);
    }, []);

    const onSelectStatusHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition | undefined,
        status: OrderStatuses | OrderPositionStatuses) => {
        if (!!position) {
            setOrderPositionStatus(order, position, status as unknown as OrderPositionStatuses);
            setSelectStatusData(undefined);
        } else {
            setOrderStatus(order, status as unknown as OrderStatuses);
            setSelectStatusData(undefined);
        }
    }, []);

    const setOrderStatus = useCallback((order: ICompiledOrder, status: OrderStatuses) => {
        const unsubscribe$ = new Subject<void>();
        if (status !== order.status) {
            orderApiService.changeOrderStatus(order.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    _onSetOrderStatus(order.id as string, status);
                    _onSetOrdersVersion(data.meta.ref.version);
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
                                    setOrderStatus(order, status);
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
    }, [_orders]);

    const onSelectOrderHandler = useCallback((order: ICompiledOrder, isAnyStatus: boolean) => {
        if (isAnyStatus) {
            const statuses = ORDER_STATUS_LIST.filter(s => s.value > getMinimumPositionsStatus(order.positions));

            if (statuses.length > 0) {
                setSelectStatusData({
                    order,
                    position: undefined,
                    statuses,
                });
            }
        } else {
            const status = getNextOrderStatus(order.status);
            setOrderStatus(order, status);
        }
    }, []);

    const setOrderPositionStatus = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, status: OrderPositionStatuses) => {
        const unsubscribe$ = new Subject<void>();

        if (status !== position.status) {
            orderApiService.changeOrderPositionStatus(order.id as string, position.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    _onSetOrderPositionStatus(order.id as string, position.id as string, data.data.status, status);
                    _onSetOrdersVersion(data.meta.ref.version);
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
                                    setOrderPositionStatus(order, position, status);
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

    const onSelectOrderPositionHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, isAnyStatus: boolean) => {
        if (isAnyStatus) {
            setSelectStatusData({
                order,
                position,
                statuses: ORDER_POSITION_STATUS_LIST.filter(s => s.value !== position.status),
            });
        } else {
            const status = getNextOrderPositionStatus(position.status);
            setOrderPositionStatus(order, position, status);
        }
    }, []);

    return (
        <View style={{
            width: "100%", height: "100%",
            backgroundColor: theme.themes[theme.name].intro.background
        }}>
            <StatusPicker data={selectStatusData} onSelect={onSelectStatusHandler} onClose={onCloseSelectStatusHandler} />
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