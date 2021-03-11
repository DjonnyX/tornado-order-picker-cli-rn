import { Action } from "redux";

export enum SystemActionTypes {
    SET_SERIAL_NUMBER = "TORNADO/system/set-serial-number",
    SET_TERMINAL_ID = "TORNADO/system/set-terminal-id",
    SET_STORE_ID = "TORNADO/system/set-store-id",
    SET_SETUP_STEP = "TORNADO/system/set-setup-step",
}

interface ISystemSetSerialNumber extends Action<SystemActionTypes.SET_SERIAL_NUMBER> {
    serialNumber: string | undefined;
}

interface ISystemSetTerminalId extends Action<SystemActionTypes.SET_TERMINAL_ID> {
    terminalId: string | undefined;
}

interface ISystemSetStoreId extends Action<SystemActionTypes.SET_STORE_ID> {
    storeId: string | undefined;
}

interface ISystemSetupStep extends Action<SystemActionTypes.SET_SETUP_STEP> {
    setupStep: number;
}

export class SystemActions {
    static setSerialNumber = (serialNumber: string | undefined): ISystemSetSerialNumber => ({
        type: SystemActionTypes.SET_SERIAL_NUMBER,
        serialNumber,
    });
    
    static setTerminalId = (terminalId: string | undefined): ISystemSetTerminalId => ({
        type: SystemActionTypes.SET_TERMINAL_ID,
        terminalId,
    });
    
    static setStoreId = (storeId: string | undefined): ISystemSetStoreId => ({
        type: SystemActionTypes.SET_STORE_ID,
        storeId,
    });
    
    static setSetupStep = (setupStep: number): ISystemSetupStep => ({
        type: SystemActionTypes.SET_SETUP_STEP,
        setupStep,
    });
}

export type TSystemActions = ISystemSetSerialNumber | ISystemSetTerminalId | ISystemSetupStep | ISystemSetStoreId;