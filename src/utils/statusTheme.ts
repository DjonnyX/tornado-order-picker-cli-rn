import { IOrderPickerOrderStatusTheme, IOrderPickerThemeColors, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";

export const getOrderStatusTheme = (theme: IOrderPickerThemeColors, status: OrderStatuses): IOrderPickerOrderStatusTheme | undefined => {
    switch (status) {
        case OrderStatuses.NEW: {
            return theme.orders.items.new;
        }
        case OrderStatuses.IN_PROCESS: {
            return theme.orders.items.process;
        }
        case OrderStatuses.COMPLETE: {
            return theme.orders.items.complete;
        }
        case OrderStatuses.CANCELED: {
            return theme.orders.items.canceled;
        }
    }

    return undefined;
}

export const getPositionStatusTheme = (theme: IOrderPickerThemeColors, status: OrderPositionStatuses): IOrderPickerOrderStatusTheme | undefined => {
    switch (status) {
        case OrderPositionStatuses.NEW: {
            return theme.orders.items.new;
        }
        case OrderPositionStatuses.IN_PROCESS: {
            return theme.orders.items.process;
        }
        case OrderPositionStatuses.COMPLETE: {
            return theme.orders.items.complete;
        }
        case OrderPositionStatuses.CANCELED: {
            return theme.orders.items.canceled;
        }
    }

    return undefined;
}