import { IAlertState, ISnackState } from "../../interfaces";

export interface INotificationState {
    alert: IAlertState;
    snack: ISnackState;
}