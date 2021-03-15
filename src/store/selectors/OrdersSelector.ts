import { createSelector } from "reselect";
import { IAppState } from "../state";

const getOrders = (state: IAppState) => state.orders;

export namespace OrdersSelectors {
    export const selectVersion = createSelector(getOrders, (state) => {
        return state?.version;
    });

    export const selectCollection = createSelector(getOrders, (state) => {
        return state?.collection;
    });
}