import React, { Dispatch, PureComponent } from "react";
import { GestureResponderEvent, View } from "react-native";
import { connect } from "react-redux";
import { config } from "../Config";
import { IAppState } from "../store/state";
import { CapabilitiesSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";
import { MyOrderActions, NotificationActions } from "../store/actions";
import { IAlertState } from "../interfaces";

interface IUserIdleServiceProps {
    // store
    _onReset: () => void;
    _currentScreen: MainNavigationScreenTypes | undefined;
    _alertOpen: (alert: IAlertState) => void;
    _alertClose: () => void;

    // self
    onIdle?: () => void;
    children: Array<JSX.Element> | JSX.Element;
}

interface IUserIdleServiceState {
    countdown: number;
}

class UserIdleServiceContainer extends PureComponent<IUserIdleServiceProps, IUserIdleServiceState> {

    private _timer: NodeJS.Timeout | undefined;

    private _countdownTimer: NodeJS.Timeout | undefined;

    private _touchProcessHandler = (e: GestureResponderEvent): void => {
        this.resetTimer();
    }

    private _onIdle = () => {
        switch (this.props._currentScreen) {
            case MainNavigationScreenTypes.LOADING:
            case MainNavigationScreenTypes.INTRO:
            case MainNavigationScreenTypes.AUTH:
            case MainNavigationScreenTypes.PAY_STATUS:
            case MainNavigationScreenTypes.PAY_CONFIRMATION:
                this.resetTimer();
                break;
            default: {
                if (this.props.onIdle !== undefined) {
                    this.props.onIdle();
                }

                this.runCountdown();
            }
        }
    }

    private _onCountdown = () => {
        if (this.state.countdown <= 1) {
            this.props._alertClose();
            this.resetCountdownTimer();
            this.resetStore();
            return;
        }

        this.setState((state) => ({
            ...state,
            countdown: state.countdown - 1,
        }), () => {
            this.showAlert();
        });
    }

    private _alertResetAction = () => {
        this.resetHandler();
        this.props._alertClose();
    };

    private _alertCancelAction = () => {
        this.cancelResetHandler();
        this.props._alertClose();
    };

    constructor(props: any) {
        super(props);

        this.state = {
            countdown: 0,
        }
    }

    componentDidMount() {
        this.resetTimer();
    }

    private showAlert(): void {
        this.props._alertOpen({
            title: "Внимание!", message: `Заказ будет отменен через ${this.state.countdown} сек`, buttons: [
                {
                    title: "Удалить",
                    action: this._alertResetAction,
                },
                {
                    title: "Отмена",
                    action: this._alertCancelAction,
                }
            ]
        });
    }

    private runCountdown(): void {
        this.stopTimer();

        this.setState((state) => ({
            ...state,
            countdown: 10,
        }), () => {
            this.runCoutndownTimer();
            this.showAlert();
        });
    }

    private runCoutndownTimer(): void {
        this._countdownTimer = setInterval(this._onCountdown, 1000);
    }

    private resetTimer(): void {
        this.stopTimer();

        this.runTimer();
    }

    private resetCountdownTimer(): void {
        if (this._countdownTimer) {
            clearInterval(this._countdownTimer);
        }
    }

    private stopTimer(): void {
        if (this._timer) {
            clearTimeout(this._timer);
        }
    }

    private runTimer(): void {
        this._timer = setTimeout(this._onIdle,
            config.capabilities.userIdleTimeout);
    }

    private cancelResetHandler = () => {
        this.props._alertClose();
        this.resetCountdownTimer();
        this.resetTimer();
    }

    private resetHandler = () => {
        this.props._alertClose();
        this.resetStore();
    }

    private resetStore = () => {
        this.resetCountdownTimer();
        this.resetTimer();
        if (this.props._onReset) {
            this.props._onReset();
        }
    }

    render() {
        const { countdown } = this.state;

        return <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <View style={{ flex: 1, width: "100%", height: "100%" }} onTouchStart={this._touchProcessHandler} onTouchEnd={this._touchProcessHandler} onTouchMove={this._touchProcessHandler}>
                {
                    this.props.children
                }
            </View>
        </View>
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onReset: () => {
            dispatch(MyOrderActions.reset());
        },
        _alertOpen: (alert: IAlertState) => {
            dispatch(NotificationActions.alertOpen(alert));
        },
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const UserIdleService = connect(mapStateToProps, mapDispatchToProps)(UserIdleServiceContainer);