import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { View } from "react-native";
import { connect } from "react-redux";
import {
    ICompiledLanguage, ICompiledOrder, ICompiledOrderPosition, ICurrency,
    IOrderPickerTheme,
    IOrderPickerThemeColors,
    OrderPositionStatuses, OrderStatuses
} from "@djonnyx/tornado-types";
import { IAppState } from "../../store/state";
import { MainNavigationScreenTypes } from "../navigation";
import { CapabilitiesSelectors, CombinedDataSelectors, OrdersSelectors } from "../../store/selectors";
import { OrderListContainer } from "../simple/order-list/OrderList";
import { NotificationActions, OrdersActions } from "../../store/actions";
import { orderApiService } from "../../services";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { IActionHandler, IAlertState } from "../../interfaces";
import { IStatusItem, IStatusPickerData, StatusPicker } from "../simple/status-selector/StatusPicker";

interface IOrdersSelfProps {
    // store props
    _theme: IOrderPickerTheme;
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

const ORDER_STATUS_LIST = (theme: IOrderPickerThemeColors): Array<IStatusItem> => ([
    {
        name: "Новый",
        value: OrderStatuses.NEW,
        color: theme.orders.items.new.backgroundColor,
        textColor: theme.orders.items.new.textColor,
    },
    {
        name: "Сборка",
        value: OrderStatuses.IN_PROCESS,
        color: theme.orders.items.process.backgroundColor,
        textColor: theme.orders.items.process.textColor,
    },
    {
        name: "Готовый",
        value: OrderStatuses.COMPLETE,
        color: theme.orders.items.complete.backgroundColor,
        textColor: theme.orders.items.complete.textColor,
    },
    {
        name: "Отменен",
        value: OrderStatuses.CANCELED,
        color: theme.orders.items.canceled.backgroundColor,
        textColor: theme.orders.items.canceled.textColor,
    }
]);

const ORDER_POSITION_STATUS_LIST = (theme: IOrderPickerThemeColors): Array<IStatusItem> => ([
    {
        name: "Новый",
        value: OrderPositionStatuses.NEW,
        color: theme.orders.items.new.position.backgroundColor,
        textColor: theme.orders.items.new.position.textColor,
    },
    {
        name: "Сборка",
        value: OrderPositionStatuses.IN_PROCESS,
        color: theme.orders.items.process.position.backgroundColor,
        textColor: theme.orders.items.process.position.textColor,
    },
    {
        name: "Готовый",
        value: OrderPositionStatuses.COMPLETE,
        color: theme.orders.items.complete.position.backgroundColor,
        textColor: theme.orders.items.complete.position.textColor,
    },
    {
        name: "Отменен",
        value: OrderPositionStatuses.CANCELED,
        color: theme.orders.items.canceled.position.backgroundColor,
        textColor: theme.orders.items.canceled.position.textColor,
    }
]);

const OrdersScreenContainer = React.memo(({ _theme, _orders, _language, _currency, navigation,
    _onSetOrdersVersion, _onSetOrderStatus, _onSetOrderPositionStatus, _alertOpen }: IOrdersProps) => {
    const [selectStatusData, setSelectStatusData] = useState<IStatusPickerData | undefined>(undefined);
    const [theme, setTheme] = useState<IOrderPickerThemeColors>(_theme?.themes?.[_theme?.name]);

    useEffect(() => {
        setTheme(_theme?.themes?.[_theme?.name]);
        console.warn(_theme)
    }, [_theme]);

    const onCloseSelectStatusHandler = useCallback(() => {
        setSelectStatusData(undefined);
    }, []);

    const onSelectStatusHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition | undefined,
        actionHandler: IActionHandler, status: OrderStatuses | OrderPositionStatuses) => {
        if (!!position) {
            setOrderPositionStatus(order, position, actionHandler, status as unknown as OrderPositionStatuses);
            setSelectStatusData(undefined);
        } else {
            setOrderStatus(order, status as unknown as OrderStatuses, actionHandler);
            setSelectStatusData(undefined);
        }
    }, []);

    const setOrderStatus = useCallback((order: ICompiledOrder, status: OrderStatuses, actionHandler: IActionHandler) => {
        const unsubscribe$ = new Subject<void>();
        if (status !== order.status) {
            actionHandler.onLoad();
            orderApiService.changeOrderStatus(order.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    actionHandler.onComplete();
                    _onSetOrderStatus(order.id as string, status);
                    _onSetOrdersVersion(data.meta.ref.version);
                },
                err => {
                    actionHandler.onComplete();
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Отмена",
                                action: () => { }
                            },
                            {
                                title: "Повторить",
                                action: () => {
                                    setOrderStatus(order, status, actionHandler);
                                }
                            }
                        ]
                    });
                }
            );
        }

        return () => {
            actionHandler.onComplete();

            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, [_orders]);

    const onSelectOrderHandler = useCallback((order: ICompiledOrder, actionHandler: IActionHandler, isAnyStatus: boolean) => {
        if (isAnyStatus) {
            const statuses = ORDER_STATUS_LIST(theme).filter(s => s.value > getMinimumPositionsStatus(order.positions));

            if (statuses.length > 0) {
                setSelectStatusData({
                    order,
                    actionHandler,
                    position: undefined,
                    statuses,
                });
            }
        } else {
            const status = getNextOrderStatus(order.status);
            setOrderStatus(order, status, actionHandler);
        }
    }, [theme]);

    const setOrderPositionStatus = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, actionHandler: IActionHandler,
        status: OrderPositionStatuses) => {

        const unsubscribe$ = new Subject<void>();

        if (status !== position.status) {
            actionHandler.onLoad();
            orderApiService.changeOrderPositionStatus(order.id as string, position.id as string, status).pipe(
                takeUntil(unsubscribe$),
            ).subscribe(
                data => {
                    actionHandler.onComplete();
                    _onSetOrderPositionStatus(order.id as string, position.id as string, data.data.status, status);
                    _onSetOrdersVersion(data.meta.ref.version);
                },
                err => {
                    actionHandler.onComplete();
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Отмена",
                                action: () => { }
                            },
                            {
                                title: "Повторить",
                                action: () => {
                                    setOrderPositionStatus(order, position, actionHandler, status);
                                }
                            }
                        ]
                    });
                }
            );
        }

        return () => {
            actionHandler.onComplete();

            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, []);

    const onSelectOrderPositionHandler = useCallback((order: ICompiledOrder, position: ICompiledOrderPosition, actionHandler: IActionHandler,
        isAnyStatus: boolean) => {

        if (isAnyStatus) {
            setSelectStatusData({
                order,
                actionHandler,
                position,
                statuses: ORDER_POSITION_STATUS_LIST(theme).filter(s => s.value !== position.status),
            });
        } else {
            const status = getNextOrderPositionStatus(position.status);
            setOrderPositionStatus(order, position, actionHandler, status);
        }
    }, [theme]);

    return (
        !!theme &&
        <View style={{
            width: "100%", height: "100%",
            backgroundColor: theme.orders.backgroundColor
        }}>
            <StatusPicker theme={theme} data={selectStatusData} onSelect={onSelectStatusHandler} onClose={onCloseSelectStatusHandler} />
            <OrderListContainer theme={theme} orders={_orders} currency={_currency} language={_language}
                onSelectOrder={onSelectOrderHandler} onSelectOrderPosition={onSelectOrderPositionHandler} />
        </View >
    );
});

const mapStateToProps = (state: IAppState, ownProps: IOrdersProps) => {
    return {
        _theme: CapabilitiesSelectors.selectTheme(state),
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