import { Reducer } from "redux";
import { SystemActionTypes, TSystemActions } from "../actions/SystemAction";
import { ISystemState } from "../state";

const initialState: ISystemState = {
    serialNumber: undefined,
    terminalId: undefined,
    storeId: undefined,
    setupStep: 0,
};

const systemReducer: Reducer<ISystemState, TSystemActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case SystemActionTypes.SET_SERIAL_NUMBER:
            return {
                ...state,
                serialNumber: action.serialNumber,
            };
        case SystemActionTypes.SET_TERMINAL_ID:
            return {
                ...state,
                terminalId: action.terminalId,
            };
        case SystemActionTypes.SET_STORE_ID:
            return {
                ...state,
                storeId: action.storeId,
            };
        case SystemActionTypes.SET_SETUP_STEP:
            return {
                ...state,
                setupStep: action.setupStep,
            };
        default:
            return state;
    }
};

export default systemReducer;