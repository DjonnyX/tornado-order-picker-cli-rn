import { ICombinedDataState } from "./CombinedDataState";
import { ICapabilitiesState } from "./CapabilitiesState";
import { IMyOrderState } from "./MyOrderState";
import { ISystemState } from "./SystemState";
import { INotificationState } from "./NotificationState";
import { IMenuState } from "./MenuState";

export interface IAppState {
    combinedData: ICombinedDataState;
    capabilities: ICapabilitiesState;
    myOrder: IMyOrderState;
    menu: IMenuState;
    system: ISystemState;
    notification: INotificationState;
}