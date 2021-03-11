import React, { Dispatch, useCallback, useEffect, useState } from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import { Picker } from '@react-native-community/picker';
import { View, TextInput, Text } from "react-native";
import { connect } from "react-redux";
import { CommonActions } from "@react-navigation/native";
import { take, takeUntil } from "rxjs/operators";
import { IStore } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../navigation";
import { IAppState } from "../../store/state";
import { CombinedDataSelectors, SystemSelectors } from "../../store/selectors";
import { theme } from "../../theme";
import { NotificationActions } from "../../store/actions";
import { orderApiService, refApiService } from "../../services";
import { SystemActions } from "../../store/actions/SystemAction";
import { SimpleButton } from "../simple";
import { IAlertState } from "../../interfaces";
import { Subject } from "rxjs";

interface IFormSNProps {
    value: string;
    isProgress: boolean;
    onComplete: (value: string) => void;
}

const SN_STATE = {
    value: "",
}

const FormSN = React.memo(({ value, isProgress, onComplete }: IFormSNProps) => {
    const [serialNumber, setSerialNumber] = useState<string>(value);

    useEffect(() => {
        SN_STATE.value = value;
    }, [value]);

    const changeSerialNumHandler = (val: string) => {
        setSerialNumber(() => {
            SN_STATE.value = val;
            return val;
        });
    };

    const completeHandler = () => {
        onComplete(SN_STATE.value);
    }

    const isValid = serialNumber !== undefined && serialNumber.length > 0;
    return <>
        <View style={{ marginBottom: 12 }}>
            <TextInput keyboardType="number-pad" placeholderTextColor={theme.themes[theme.name].service.textInput.placeholderColor}
                selectionColor={theme.themes[theme.name].service.textInput.selectionColor}
                underlineColorAndroid={isValid
                    ? theme.themes[theme.name].service.textInput.underlineColor
                    : theme.themes[theme.name].service.textInput.underlineWrongColor
                }
                style={{
                    fontSize: 16,
                    textAlign: "center", color: theme.themes[theme.name].service.textInput.textColor,
                    minWidth: 140, marginBottom: 12
                }} editable={!isProgress}
                placeholder="Серийный ключ" onChangeText={changeSerialNumHandler} value={serialNumber} />
            {
                !isValid &&
                <Text style={{ fontSize: 12, color: theme.themes[theme.name].service.errorLabel.textColor }}>
                    * Обязательное поле
        </Text>
            }
        </View>
        <SimpleButton style={{ backgroundColor: theme.themes[theme.name].service.button.backgroundColor, minWidth: 180 }}
            textStyle={{ fontSize: 16, color: theme.themes[theme.name].service.button.textColor }}
            onPress={() => { completeHandler() }} title="Зарегистрировать" disabled={isProgress || !isValid} />
    </>
});

interface IFormTParams {
    stores: Array<IStore>;
    isProgress: boolean;
    onComplete: (terminalName: string, storeId: string) => void;
}

const FormTParams = React.memo(({ stores, isProgress, onComplete }: IFormTParams) => {
    const [terminalName, setTerminalName] = useState<string>("");
    const [storeId, setStoreId] = useState<string>("");

    const changeTerminalNameHandler = (val: string) => {
        setTerminalName(val);
    };

    const completeHandler = () => {
        console.warn(terminalName, storeId)
        onComplete(terminalName, storeId);
    }

    const isTerminalNameValid = terminalName !== undefined && terminalName.length > 0;
    const isStoreIdValid = storeId !== undefined && storeId.length > 1;
    const isStep2Valid = isTerminalNameValid && isStoreIdValid;
    return <>
        <View style={{ marginBottom: 12 }}>
            <TextInput keyboardType="default" placeholderTextColor={theme.themes[theme.name].service.textInput.placeholderColor}
                selectionColor={theme.themes[theme.name].service.textInput.selectionColor}
                underlineColorAndroid={isTerminalNameValid
                    ? theme.themes[theme.name].service.textInput.underlineColor
                    : theme.themes[theme.name].service.textInput.underlineWrongColor
                }
                style={{
                    fontSize: 16,
                    textAlign: "center", color: theme.themes[theme.name].service.textInput.textColor,
                    minWidth: 180
                }} editable={!isProgress}
                placeholder="Название терминала" onChangeText={changeTerminalNameHandler} value={terminalName} />
            {
                !isTerminalNameValid &&
                <Text style={{ fontSize: 12, color: theme.themes[theme.name].service.errorLabel.textColor }}>
                    * Обязательное поле
        </Text>
            }
        </View>
        <View style={{ marginBottom: 12 }}>
            <Picker
                mode="dropdown"
                selectedValue={storeId}
                style={{
                    textAlign: "center", minWidth: 180,
                    color: isStoreIdValid
                        ? theme.themes[theme.name].service.picker.textColor
                        : theme.themes[theme.name].service.textInput.placeholderColor,
                }}
                onValueChange={(itemValue, itemIndex) => {
                    if (itemIndex > 0) {
                        setStoreId(String(itemValue));
                    }
                }}
            >
                <Picker.Item key="placeholder" color={theme.themes[theme.name].service.picker.placeholderColor} value=""
                    label='Выберите магазин' />
                {
                    stores.map(store => <Picker.Item key={store.id} color="black" label={store.name} value={store.id || ""} />)

                }
            </Picker>
            {
                !isStoreIdValid &&
                <Text style={{ fontSize: 12, color: theme.themes[theme.name].service.errorLabel.textColor }}>
                    * Обязательное поле
            </Text>
            }
        </View>
        <SimpleButton style={{ backgroundColor: theme.themes[theme.name].service.button.backgroundColor, minWidth: 180 }}
            textStyle={{ fontSize: 16, color: theme.themes[theme.name].service.button.textColor }}
            onPress={completeHandler} title="Сохранить" disabled={isProgress || !isStep2Valid} />
    </>
})

interface IAuthSelfProps {
    // store props
    _onChangeSerialNumber: (serialNumber: string) => void;
    _onChangeSetupStep: (setupStep: number) => void;
    _onChangeTerminalId: (terminalId: string) => void;
    _onChangeStoreId: (storeId: string) => void;
    _alertOpen: (alert: IAlertState) => void;
    _progress: number;
    _serialNumber: string;
    _setupStep: number;
    _terminalId: string;
    _storeId: string;
    _currentScreen: MainNavigationScreenTypes | undefined;

    // self props
}

interface IAuthProps extends StackScreenProps<any, MainNavigationScreenTypes.LOADING>, IAuthSelfProps { }

const AuthScreenContainer = React.memo(({ _serialNumber, _setupStep, _terminalId, _storeId, navigation,
    _alertOpen, _onChangeSerialNumber, _onChangeSetupStep, _onChangeTerminalId, _onChangeStoreId,
}: IAuthProps) => {
    const [stores, setStores] = useState<Array<IStore>>([]);
    const [isLicenseValid, setLicenseValid] = useState<boolean>(false);
    const [showProgressBar, setShowProgressBar] = useState<boolean>(false);
    const [retryVerificationId, setRetryVerificationId] = useState<number>(0);
    const [retryGetStores, setRetryGetStores] = useState<number>(0);

    useEffect(() => {
        const unsubscribe$ = new Subject<void>();

        if (_setupStep === 2) {
            if (!!_serialNumber && !!_terminalId && !!_storeId) {
                setShowProgressBar(true);

                refApiService.terminalLicenseVerify(_serialNumber).pipe(
                    take(1),
                    takeUntil(unsubscribe$),
                ).subscribe(
                    l => {
                        setLicenseValid(true);

                        setShowProgressBar(false);

                        refApiService.serial = orderApiService.serial = _serialNumber;

                        // License valid!
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: MainNavigationScreenTypes.LOADING },
                                ],
                            })
                        );
                    },
                    err => {
                        _alertOpen({
                            title: "Ошибка", message: err.message ? err.message : err, buttons: [
                                {
                                    title: "Отмена",
                                    action: () => {
                                        _onChangeSetupStep(0);
                                    }
                                },
                                {
                                    title: "Повторить",
                                    action: () => {
                                        retryVerificationHandler();
                                    }
                                }
                            ]
                        });

                        // License invalid
                        setShowProgressBar(false);
                        setLicenseValid(false);
                    },
                );
            } else {
                setLicenseValid(false);
            }
        }
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, [_serialNumber, _terminalId, _storeId, _setupStep, retryVerificationId]);

    useEffect(() => {
        const unsubscribe$ = new Subject<void>();

        if (_setupStep === 1) {
            refApiService.getStores({
                serial: _serialNumber,
            }).pipe(
                take(1),
                takeUntil(unsubscribe$),
            ).subscribe(
                v => {
                    setStores(v);
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
                                    retryGetStoresHandler();
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
    }, [_setupStep, retryGetStores]);

    const retryGetStoresHandler = useCallback(() => {
        setRetryGetStores(() => retryGetStores + 1);
    }, [retryGetStores]);

    const retryVerificationHandler = useCallback(() => {
        setRetryVerificationId(() => retryVerificationId + 1);
    }, [retryVerificationId]);

    const authHandler = (sn: string) => {
        setShowProgressBar(true);
        console.warn(sn)

        const unsubscribe$ = new Subject<void>();

        refApiService.terminalRegistration(sn).pipe(
            take(1),
            takeUntil(unsubscribe$),
        ).subscribe(
            t => {
                _onChangeSerialNumber(sn);

                _onChangeTerminalId(t.id || "");

                _onChangeSetupStep(1);

                setShowProgressBar(false);
            },
            err => {
                _alertOpen({
                    title: "Ошибка", message: err.message ? err.message : err, buttons: [
                        {
                            title: "Закрыть",
                        }
                    ]
                });
                setShowProgressBar(false);
            }
        );
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        }
    };

    const saveParamsHandler = useCallback((terminalName: string, storeId: string) => {
        if (!_terminalId) {
            return;
        }

        setShowProgressBar(true);

        const unsubscribe$ = new Subject<void>();

        refApiService.terminalSetParams(_terminalId, { name: terminalName, storeId }).pipe(
            take(1),
            takeUntil(unsubscribe$),
        ).subscribe(
            t => {
                setShowProgressBar(false);

                _onChangeTerminalId(_terminalId);

                _onChangeStoreId(storeId);

                _onChangeSetupStep(2);
            },
            err => {
                _alertOpen({
                    title: "Ошибка", message: err.message ? err.message : err, buttons: [
                        {
                            title: "Закрыть",
                        }
                    ]
                });
                setShowProgressBar(false);
            }
        );
        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        }
    }, [_storeId, _terminalId]);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.themes[theme.name].loading.background }}>
            {
                !isLicenseValid &&
                <>
                    {
                        // Enter serial number
                        _setupStep === 0 &&
                        <FormSN value={_serialNumber} isProgress={showProgressBar} onComplete={authHandler} />
                    }
                    {
                        // Enter terminal name and store
                        _setupStep === 1 &&
                        <FormTParams stores={stores} isProgress={showProgressBar} onComplete={saveParamsHandler} />
                    }
                </>
            }
            {
                !!showProgressBar &&
                <ProgressBar
                    style={{ width: "100%", marginTop: 12, maxWidth: 140, marginLeft: "10%", marginRight: "10%" }}
                    styleAttr="Horizontal"
                    indeterminate={true}
                    color={theme.themes[theme.name].loading.progressBar.trackColor}></ProgressBar>
            }
        </View>
    );
});

const mapStateToProps = (state: IAppState, ownProps: IAuthProps) => {
    return {
        _progress: CombinedDataSelectors.selectProgress(state),
        _serialNumber: SystemSelectors.selectSerialNumber(state),
        _setupStep: SystemSelectors.selectSetupStep(state),
        _terminalId: SystemSelectors.selectTerminalId(state),
        _storeId: SystemSelectors.selectStoreId(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _onChangeSerialNumber: (serialNumber: string) => {
            dispatch(SystemActions.setSerialNumber(serialNumber));
        },
        _onChangeSetupStep: (setupStep: number) => {
            dispatch(SystemActions.setSetupStep(setupStep));
        },
        _onChangeTerminalId: (terminalId: string) => {
            dispatch(SystemActions.setTerminalId(terminalId));
        },
        _onChangeStoreId: (storeId: string) => {
            dispatch(SystemActions.setStoreId(storeId));
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
    };
};

export const AuthScreen = connect(mapStateToProps, mapDispatchToProps)(AuthScreenContainer);