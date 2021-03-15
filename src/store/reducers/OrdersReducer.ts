import { ICompiledOrder, ICompiledOrderPosition, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";
import { Reducer } from "redux";
import { TOrdersActions, OrdersActionTypes } from "../actions";
import { IOrdersState } from "../state";

const setPositionStatus = (order: ICompiledOrder, positionId: string, status: OrderPositionStatuses) => {
    findPositionAndSetStatus(order.positions, positionId, status);
}

const findPositionAndSetStatus = (positions: Array<ICompiledOrderPosition>, positionId: string, status: OrderPositionStatuses): boolean => {
    for (let i = 0, l = positions.length; i < l; i++) {
        const pos = positions[i];

        if (pos.id === positionId) {
            const newPos = { ...pos, status };
            positions[i] = newPos;
            return true;
        }

        const isFound = findPositionAndSetStatus(pos.children, positionId, status);
        if (isFound) {
            return true;
        }
    }

    return false;
}

const getMinimumPositionsStatus = (positions: Array<ICompiledOrderPosition>): OrderPositionStatuses => {
    let minimumStatus: OrderPositionStatuses = OrderPositionStatuses.CANCELED;
    for (let i = 0, l = positions.length; i < l; i++) {
        const pos = positions[i];

        minimumStatus = Math.min(minimumStatus, pos.status, getMinimumPositionsStatus(pos.children));
    }

    return minimumStatus;
}

const setOrderStatusByMinimumPositionsStatus = (order: ICompiledOrder) => {
    const status: OrderPositionStatuses = getMinimumPositionsStatus(order.positions);

    let orderStatus: OrderStatuses | undefined;
    switch (status) {
        case OrderPositionStatuses.NEW: {
            orderStatus = OrderStatuses.NEW;
            break;
        }
        case OrderPositionStatuses.IN_PROCESS: {
            orderStatus = OrderStatuses.IN_PROCESS;
            break;
        }
        case OrderPositionStatuses.COMPLETE: {
            orderStatus = OrderStatuses.COMPLETE;
            break;
        }
        case OrderPositionStatuses.CANCELED: {
            orderStatus = OrderStatuses.CANCELED;
            break;
        }
    }
    if (orderStatus !== undefined) {
        order.status = orderStatus;
    }
}

const setPositionsStatus = (order: ICompiledOrder, status: OrderStatuses) => {
    let positionsStatus: OrderPositionStatuses | undefined;
    switch (status) {
        case OrderStatuses.NEW: {
            positionsStatus = OrderPositionStatuses.NEW;
            break;
        }
        case OrderStatuses.IN_PROCESS: {
            positionsStatus = OrderPositionStatuses.IN_PROCESS;
            break;
        }
        case OrderStatuses.COMPLETE: {
            positionsStatus = OrderPositionStatuses.COMPLETE;
            break;
        }
        case OrderStatuses.CANCELED: {
            positionsStatus = OrderPositionStatuses.CANCELED;
            break;
        }
    }
    if (positionsStatus !== undefined) {
        setOrderPositionStatus(order.positions, positionsStatus);
    }
}

const setOrderPositionStatus = (positions: Array<ICompiledOrderPosition>, status: OrderPositionStatuses) => {
    for (let i = 0, l = positions.length; i < l; i++) {
        const pos = positions[i];

        if (pos.status < status) {
            positions[i] = { ...pos, status };
        }

        setOrderPositionStatus(pos.children, status);
    }
}

const initialState: IOrdersState = {
    version: 0,
    collection: [],
};

const ordersReducer: Reducer<IOrdersState, TOrdersActions> = (
    state = initialState,
    action,
) => {
    switch (action.type) {
        case OrdersActionTypes.SET_VERSION:
            return {
                ...state,
                version: action.version,
            };
        case OrdersActionTypes.SET_COLLECTION:
            return {
                ...state,
                collection: action.collection,
            };
        case OrdersActionTypes.SET_ORDER_STATUS:
            const orderIndex = state.collection.findIndex(o => o.id === action.orderId);
            if (orderIndex > -1) {
                const order = state.collection[orderIndex];
                const newOrder = { ...order, status: action.status };

                setPositionsStatus(newOrder, newOrder.status);

                const collection = [...state.collection];
                collection[orderIndex] = newOrder;

                return {
                    ...state,
                    collection,
                }
            }
            return state;
        case OrdersActionTypes.SET_ORDER_POSITION_STATUS:
            const orderIndex1 = state.collection.findIndex(o => o.id === action.orderId);
            if (orderIndex1 > -1) {
                const order = state.collection[orderIndex1];
                const newOrder = { ...order, status: action.orderStatus };

                setPositionStatus(newOrder, action.positionId, action.positionStatus);

                setOrderStatusByMinimumPositionsStatus(newOrder);

                const collection = [...state.collection];
                collection[orderIndex1] = newOrder;

                return {
                    ...state,
                    collection,
                }
            }
            return state;
        default:
            return state;
    }
};

export default ordersReducer;