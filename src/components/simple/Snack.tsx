import React, { Dispatch, useEffect } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { NotificationActions } from "../../store/actions";
import { IAppState } from "../../store/state";
import { theme } from "../../theme";
import { NotificationModal } from "./NotificationModal";

interface ISnackProps {
    // store
    _snackClose?: () => void;

    // self
    message: string;
    visible: boolean;
    duration: number;
    onComplete?: () => void;
}

const SnackContainer = React.memo(({ message, duration, visible, onComplete, _snackClose }: ISnackProps) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!!_snackClose) {
                _snackClose();
            }

            if (!!onComplete) {
                onComplete();
            }
        }, duration);

        return () => {
            clearTimeout(timeout);
        }
    }, [visible, duration, message]);
    return (
        <NotificationModal visible={visible}>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.themes[theme.name].common.notificationAlert.textColor }}>{message}</Text>
        </NotificationModal>
    );
})
const mapStateToProps = (state: IAppState, ownProps: ISnackProps) => {
    return {

    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>): any => {
    return {
        _snackClose: () => {
            dispatch(NotificationActions.snackClose());
        },
    };
};

export const Snack = connect(mapStateToProps, mapDispatchToProps)(SnackContainer);