import React, { Dispatch, useEffect, useState } from "react";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { ICompiledLanguage, ICompiledOrderType, ICurrency } from "@djonnyx/tornado-types";
import { OrderWizard } from "./order/OrderWizard";
import { OrderWizardEventTypes } from "./order/events";
import { CapabilitiesActions, MyOrderActions, NotificationActions } from "../store/actions";
import { CapabilitiesSelectors, CombinedDataSelectors, MyOrderSelectors } from "../store/selectors";
import { IAlertState, ISnackState } from "../interfaces";
import { IOrderWizard, IPositionWizard } from "./interfaces";
import { orderApiService } from "../services";
import { Subject } from "rxjs";
import { finalize, take, takeUntil } from "rxjs/operators";
import { MainNavigationScreenTypes } from "../components/navigation";

interface IOrderServiceProps {
    // store
    _onUpdateStateId: (stateId: number) => void;
    _snackOpen: (alert: ISnackState) => void;
    _alertOpen: (alert: IAlertState) => void;
    _setCurrentScreen: (screen: MainNavigationScreenTypes) => void;
    _setIsOrderProcessing: (value: boolean) => void;

    _orderStateId?: number;
    _orderType?: ICompiledOrderType,
    _language?: ICompiledLanguage;
    _currency?: ICurrency;
    _isOrderProcessing?: boolean;

    // self
    onNavigate?: (screen: MainNavigationScreenTypes) => void;
}

export const OrderServiceContainer = React.memo(({ _orderStateId, _language, _currency, _orderType, _isOrderProcessing,
    _setCurrentScreen, _snackOpen, _alertOpen, _onUpdateStateId, _setIsOrderProcessing, onNavigate }: IOrderServiceProps) => {
    const [orderWizard, setOrderWizard] = useState<IOrderWizard | undefined>(undefined);
    const [previousLastPosition, setPreviousLastPosition] = useState<IPositionWizard | null>(null);

    useEffect(() => {
        if (orderWizard) {
            const onOrderWizardChange = () => {
                _onUpdateStateId(orderWizard?.stateId || 0);
            }

            orderWizard.addListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            return () => {
                orderWizard.removeListener(OrderWizardEventTypes.CHANGE, onOrderWizardChange);
            }
        }
    }, [orderWizard]);

    useEffect(() => {
        const unsubscribe$ = new Subject<void>();

        if (_isOrderProcessing) {
            _setCurrentScreen(MainNavigationScreenTypes.PAY_STATUS);

            const orderData = OrderWizard.current.toOrderData();
            orderApiService.sendOrder(orderData).pipe(
                take(1),
                takeUntil(unsubscribe$),
                finalize(() => {
                    _setIsOrderProcessing(false);
                })
            ).subscribe(
                order => {
                    OrderWizard.current.result = order;

                    _setCurrentScreen(MainNavigationScreenTypes.PAY_CONFIRMATION);
                },
                err => {
                    _setCurrentScreen(MainNavigationScreenTypes.CONFIRMATION_ORDER);
                    _alertOpen({
                        title: "Ошибка", message: err.message ? err.message : err, buttons: [
                            {
                                title: "Отмена",
                                action: () => { }
                            },
                            {
                                title: "Повторить",
                                action: () => {
                                    _setIsOrderProcessing(true);
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
        };
    }, [_isOrderProcessing]);

    useEffect(() => {
        if (!!_language && !!_currency && !!_orderType) {

            if (!orderWizard) {
                const ow = new OrderWizard(_currency, _language, _orderType);
                setOrderWizard(ow);

            } else {
                orderWizard.orderType = _orderType;
                orderWizard.currency = _currency;
                orderWizard.language = _language;
            }
        }
    }, [_language, _orderType, _currency]);

    useEffect(() => {
        if (!!OrderWizard?.current?.lastPosition && previousLastPosition !== OrderWizard.current.lastPosition) {
            setPreviousLastPosition(OrderWizard.current.lastPosition);
        }
    }, [_orderStateId]);

    useEffect(() => {
        if (!!previousLastPosition) {
            _snackOpen({
                message: `"${previousLastPosition?.__product__?.contents[_language?.code || ""]?.name}" добавлен в заказ!`,
                duration: 5000,
            });
        }
    }, [previousLastPosition]);

    return <></>;
});

const mapStateToProps = (state: IAppState) => {
    return {
        _language: CapabilitiesSelectors.selectLanguage(state),
        _currency: CombinedDataSelectors.selectDefaultCurrency(state),
        _orderType: CapabilitiesSelectors.selectOrderType(state),
        _orderStateId: MyOrderSelectors.selectStateId(state),
        _isOrderProcessing: MyOrderSelectors.selectIsProcessing(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onUpdateStateId: (stateId: number) => {
            dispatch(MyOrderActions.updateStateId(stateId));
        },
        _snackOpen: (snack: ISnackState) => {
            dispatch(NotificationActions.snackOpen(snack));
        },
        _setCurrentScreen: (screen: MainNavigationScreenTypes) => {
            dispatch(CapabilitiesActions.setCurrentScreen(screen));
        },
        _setIsOrderProcessing: (value: boolean) => {
            dispatch(MyOrderActions.isProcessing(value));
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const OrderService = connect(mapStateToProps, mapDispatchToProps)(OrderServiceContainer);