import { Action } from "redux";
import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";
import { StackNavigationProp } from "@react-navigation/stack";

export enum CapabilitiesActionTypes {
    SET_LANGUAGE = "TORNADO/capabilities/set-language",
    SET_ORDER_TYPE = "TORNADO/capabilities/set-order-type",
    SET_CURRENT_SCREEN = "TORNADO/capabilities/set-current-screen",
}

interface ICapabilitiesActionSetLanguage extends Action<CapabilitiesActionTypes.SET_LANGUAGE> {
    language: ICompiledLanguage;
}

interface ICapabilitiesActionSetOrderType extends Action<CapabilitiesActionTypes.SET_ORDER_TYPE> {
    orderType: ICompiledOrderType;
}

interface ICapabilitiesActionSetCurrentScreen extends Action<CapabilitiesActionTypes.SET_CURRENT_SCREEN> {
    currentScreen: MainNavigationScreenTypes;
}

export class CapabilitiesActions {
    static setLanguage = (language: ICompiledLanguage): ICapabilitiesActionSetLanguage => ({
        type: CapabilitiesActionTypes.SET_LANGUAGE,
        language,
    });

    static setOrderType = (orderType: ICompiledOrderType): ICapabilitiesActionSetOrderType => ({
        type: CapabilitiesActionTypes.SET_ORDER_TYPE,
        orderType,
    });

    static setCurrentScreen = (currentScreen: MainNavigationScreenTypes): ICapabilitiesActionSetCurrentScreen => ({
        type: CapabilitiesActionTypes.SET_CURRENT_SCREEN,
        currentScreen,
    });
}

export type TCapabilitiesActions = ICapabilitiesActionSetLanguage | ICapabilitiesActionSetOrderType
| ICapabilitiesActionSetCurrentScreen;