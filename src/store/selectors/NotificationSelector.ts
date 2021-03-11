import { createSelector } from "reselect";
import { IAppState } from "../state";

const getNotification = (state: IAppState) => state.notification;

export namespace NotificationSelectors {
    export const selectAlert = createSelector(getNotification, (state) => {
        return state.alert;
    });

    export const selectSnack = createSelector(getNotification, (state) => {
        return state.snack;
    });
}