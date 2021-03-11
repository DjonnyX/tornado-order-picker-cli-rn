import { Action } from "redux";
import { IAlertState, ISnackState } from "../../interfaces";

export enum NotificationActionTypes {
    SET_ALERT = "TORNADO/system/set-alert",
    SET_SNACK = "TORNADO/system/set-snack",
}

interface INotificationSetAlert extends Action<NotificationActionTypes.SET_ALERT> {
    alert: IAlertState;
}

interface INotificationSetSnack extends Action<NotificationActionTypes.SET_SNACK> {
    snack: ISnackState;
}

export class NotificationActions {
    static alertOpen = (alert: IAlertState): INotificationSetAlert => ({
        type: NotificationActionTypes.SET_ALERT,
        alert: { ...alert, visible: true },
    });

    static alertClose = (): INotificationSetAlert => ({
        type: NotificationActionTypes.SET_ALERT,
        alert: {
            visible: false,
            title: "",
            message: "",
            buttons: [],
        },
    });

    static snackOpen = (snack: ISnackState): INotificationSetSnack => ({
        type: NotificationActionTypes.SET_SNACK,
        snack: { ...snack, visible: true, duration: snack.duration },
    });

    static snackClose = (): INotificationSetSnack => ({
        type: NotificationActionTypes.SET_SNACK,
        snack: {
            visible: false,
            message: "",
        },
    });
}

export type TNotificationActions = INotificationSetAlert | INotificationSetSnack;