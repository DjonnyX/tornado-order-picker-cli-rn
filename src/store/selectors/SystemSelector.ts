import { createSelector } from "reselect";
import { IAppState } from "../state";

const getSystem = (state: IAppState) => state.system;

export namespace SystemSelectors {
    export const selectSerialNumber = createSelector(getSystem, (state) => {
        return state.serialNumber;
    });
    
    export const selectSetupStep = createSelector(getSystem, (state) => {
        return state.setupStep;
    });
    
    export const selectTerminalId = createSelector(getSystem, (state) => {
        return state.terminalId;
    });
    
    export const selectStoreId = createSelector(getSystem, (state) => {
        return state.storeId;
    });
}