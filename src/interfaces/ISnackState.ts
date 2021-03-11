export interface ISnackState {
    visible?: boolean;
    message?: string;
    duration?: number;
    onComplete?: () => void;
}