import React, { Dispatch, Component, useState, useEffect } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import { IAppState } from "../store/state";
import { NotificationActions } from "../store/actions";
import { ISnackState } from "../interfaces";
import { Snack } from "../components/simple/Snack";
import { NotificationSelectors } from "../store/selectors";

interface ISnackServiceProps {
    // store
    _snackParams: ISnackState;
}

export const SnackServiceContainer = React.memo(({ _snackParams }: ISnackServiceProps) => {
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        if (_snackParams.message) {
            setMessage(_snackParams.message);
        }
    }, [_snackParams]);


    return <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, }}>
        <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <Snack message={message}
                visible={_snackParams?.visible || false}
                duration={_snackParams?.duration || 10000}
                onComplete={_snackParams.onComplete}
            />
        </View>
    </View>
});

const mapStateToProps = (state: IAppState) => {
    return {
        _snackParams: NotificationSelectors.selectSnack(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _alertClose: () => {
            dispatch(NotificationActions.alertClose());
        },
    };
};

export const SnackService = connect(mapStateToProps, mapDispatchToProps)(SnackServiceContainer);