import { IOrderPickerOrderStatusTheme, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";
import { theme } from "../theme";

export const getOrderStatusTheme = (status: OrderStatuses): IOrderPickerOrderStatusTheme | undefined => {
    switch (status) {
        case OrderStatuses.NEW: {
            return theme.themes[theme.name].orders.items.new;
        }
        case OrderStatuses.IN_PROCESS: {
            return theme.themes[theme.name].orders.items.process;
        }
        case OrderStatuses.COMPLETE: {
            return theme.themes[theme.name].orders.items.complete;
        }
        case OrderStatuses.CANCELED: {
            return theme.themes[theme.name].orders.items.canceled;
        }
    }

    return undefined;
}

export const getPositionStatusTheme = (status: OrderPositionStatuses): IOrderPickerOrderStatusTheme | undefined => {
    switch (status) {
        case OrderPositionStatuses.NEW: {
            return theme.themes[theme.name].orders.items.new;
        }
        case OrderPositionStatuses.IN_PROCESS: {
            return theme.themes[theme.name].orders.items.process;
        }
        case OrderPositionStatuses.COMPLETE: {
            return theme.themes[theme.name].orders.items.complete;
        }
        case OrderPositionStatuses.CANCELED: {
            return theme.themes[theme.name].orders.items.canceled;
        }
    }

    return undefined;
}