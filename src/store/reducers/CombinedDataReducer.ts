import { Reducer } from "redux";
import { TCombinedDataActions, CombinedDataActionTypes } from "../actions";
import { ICombinedDataState } from "../state";

const initialState: ICombinedDataState = {
    data: null,
    progress: {
        total: 0,
        current: 0,
    },
};

const combinedDataReducer: Reducer<ICombinedDataState, TCombinedDataActions> = (
    state = initialState,
    action
) => {
    switch (action.type) {
        case CombinedDataActionTypes.SET_DATA:
            return {
                ...state,
                data: action.data,
            };
        case CombinedDataActionTypes.SET_PROGRESS:
            return {
                ...state,
                progress: action.progress,
            };
        default:
            return state;
    }
};

export default combinedDataReducer;