import { Reducer } from "redux";
import { TMenuActions, MenuActionTypes } from "../actions";
import { IMenuState } from "../state";

const initialState: IMenuState = {
    stateId: -1,
};

const menuReducer: Reducer<IMenuState, TMenuActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case MenuActionTypes.UPDATE_STATE_ID:
            return {
                ...state,
                stateId: action.stateId,
            };
        default:
            return state;
    }
};

export default menuReducer;