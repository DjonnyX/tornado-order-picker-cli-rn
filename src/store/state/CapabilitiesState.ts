import { ICompiledOrderType, ICompiledLanguage } from "@djonnyx/tornado-types";
import { MainNavigationScreenTypes } from "../../components/navigation";

export interface ICapabilitiesState {
    language: ICompiledLanguage | undefined;
    orderType: ICompiledOrderType | undefined;
    currentScreen: MainNavigationScreenTypes | undefined;
}