import { IOrderPickerThemeColors } from "@djonnyx/tornado-types";
import React, { Dispatch, useEffect } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import { NotificationActions } from "../../store/actions";
import { IAppState } from "../../store/state";
import { NotificationModal } from "./NotificationModal";

interface ISnackProps {
    // store
    theme: IOrderPickerThemeColors;
    _snackClose?: () => void;

    // self
    message: string;
    visible: boolean;
    duration: number;
    onComplete?: () => void;
}

const SnackContainer = React.memo(({ theme, message, duration, visible, onComplete, _snackClose }: ISnackProps) => {
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
        <>
            {
                !!theme &&
                <NotificationModal theme={theme} visible={visible}>
                    <Text style={{
                        fontWeight: "600", color: theme.common.notificationAlert.textColor,
                        fontSize: theme.common.notificationAlert.textFontSize
                    }}>{message}</Text>
                </NotificationModal>
            }
        </>
    );
});

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