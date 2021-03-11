import { createSelector } from "reselect";
import { IAppState } from "../state";

const getMyOrder = (state: IAppState) => state.myOrder;

export namespace MyOrderSelectors {
    export const selectStateId = createSelector(getMyOrder, (state) => {
        return state.stateId;
    });

    export const selectShowOrderTypes = createSelector(getMyOrder, (state) => {
        return state.showOrderTypes;
    });

    export const selectIsProcessing = createSelector(getMyOrder, (state) => {
        return state.isProcessing;
    });
}