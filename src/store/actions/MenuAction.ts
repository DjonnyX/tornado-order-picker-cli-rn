import { Action } from "redux";

export enum MenuActionTypes {
    UPDATE_STATE_ID = "TORNADO/menu/update-state-id",
}

interface IMenuActionUpdateStateId extends Action<MenuActionTypes.UPDATE_STATE_ID> {
    stateId: number;
}

export class MenuActions {
    static updateStateId = (stateId: number): IMenuActionUpdateStateId => ({
        type: MenuActionTypes.UPDATE_STATE_ID,
        stateId,
    });
}

export type TMenuActions = IMenuActionUpdateStateId;