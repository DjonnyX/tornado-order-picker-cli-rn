import { createStore, combineReducers } from "redux";
import { combinedDataReducer, capabilitiesReducer, myOrderReducer, systemReducer, notificationReducer, menuReducer } from "./reducers";
import { IAppState } from "./state";

const reducers = combineReducers<IAppState>({
	combinedData: combinedDataReducer,
	capabilities: capabilitiesReducer,
	myOrder: myOrderReducer,
	menu: menuReducer,
	system: systemReducer,
	notification: notificationReducer,
});

export const store = createStore(reducers);