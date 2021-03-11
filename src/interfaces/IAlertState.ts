export interface IAlertButton {
    title: string;
    action?: () => void;
}

export interface IAlertState {
    visible?: boolean;
    title?: string;
    message?: string;
    buttons: Array<IAlertButton>;
}