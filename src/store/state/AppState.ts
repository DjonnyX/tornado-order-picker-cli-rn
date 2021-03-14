import { ICombinedDataState } from "./CombinedDataState";
import { ICapabilitiesState } from "./CapabilitiesState";
import { IOrdersState } from "./OrdersState";
import { ISystemState } from "./SystemState";
import { INotificationState } from "./NotificationState";

export interface IAppState {
    combinedData: ICombinedDataState;
    capabilities: ICapabilitiesState;
    orders: IOrdersState;
    system: ISystemState;
    notification: INotificationState;
}