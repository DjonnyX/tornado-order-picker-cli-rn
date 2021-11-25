import { ICompiledOrderType, ICompiledLanguage, IOrderPickerTheme } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export interface ICapabilitiesState {
    themes: IOrderPickerTheme | undefined;
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
    currentScreen: MainNavigationScreenTypes | undefined;
}