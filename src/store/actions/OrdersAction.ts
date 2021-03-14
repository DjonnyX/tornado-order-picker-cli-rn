import { Action } from "redux";
import { ICompiledOrder, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";

export enum OrdersActionTypes {
    SET_COLLECTION = "TORNADO/orders/set-collection",
    SET_VERSION = "TORNADO/orders/set-version",
    SET_ORDER_STATUS = "TORNADO/orders/set-order-status",
    SET_ORDER_POSITION_STATUS = "TORNADO/orders/set-order-position-status",
}

interface ICombinedOrderDataActionSetCollection extends Action<OrdersActionTypes.SET_COLLECTION> {
    collection: Array<ICompiledOrder>;
}

interface ICombinedOrderDataActionSetVersion extends Action<OrdersActionTypes.SET_VERSION> {
    version: number;
}

interface ICombinedOrderDataActionSetOrderStatus extends Action<OrdersActionTypes.SET_ORDER_STATUS> {
    orderId: string;
    status: OrderStatuses;
}

interface ICombinedOrderDataActionSetOrderPositionStatus extends Action<OrdersActionTypes.SET_ORDER_POSITION_STATUS> {
    orderId: string;
    positionId: string;
    orderStatus: OrderStatuses;
    positionStatus: OrderPositionStatuses;
}

export class OrdersActions {
    static setCollection = (collection: Array<ICompiledOrder>): ICombinedOrderDataActionSetCollection => ({
        type: OrdersActionTypes.SET_COLLECTION,
        collection,
    });

    static setVersion = (version: number): ICombinedOrderDataActionSetVersion => ({
        type: OrdersActionTypes.SET_VERSION,
        version,
    });

    static setOrderStatus = (orderId: string, status: OrderStatuses): ICombinedOrderDataActionSetOrderStatus => ({
        type: OrdersActionTypes.SET_ORDER_STATUS,
        orderId,
        status,
    });

    static setOrderPositionStatus = (orderId: string, positionId: string, orderStatus: OrderStatuses,
        positionStatus: OrderPositionStatuses): ICombinedOrderDataActionSetOrderPositionStatus => ({
            type: OrdersActionTypes.SET_ORDER_POSITION_STATUS,
            orderId,
            positionId,
            orderStatus,
            positionStatus,
        });
}

export type TOrdersActions = ICombinedOrderDataActionSetCollection | ICombinedOrderDataActionSetVersion
    | ICombinedOrderDataActionSetOrderStatus | ICombinedOrderDataActionSetOrderPositionStatus;