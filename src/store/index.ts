import { createStore, combineReducers } from "redux";
import { combinedDataReducer, capabilitiesReducer, ordersReducer, systemReducer, notificationReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
	capabilities: capabilitiesReducer,
	orders: ordersReducer,
	system: systemReducer,
	notification: notificationReducer,
});

export const store = createStore(reducers);