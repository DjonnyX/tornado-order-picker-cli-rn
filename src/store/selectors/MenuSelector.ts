import { createSelector } from "reselect";
import { IAppState } from "../state";

const getMenu = (state: IAppState) => state.menu;

export namespace MenuSelectors {
    export const selectStateId = createSelector(getMenu, (state) => {
        return state.stateId;
    });
}