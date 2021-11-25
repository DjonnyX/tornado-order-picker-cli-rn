import { IOrderPickerThemeColors } from "@djonnyx/tornado-types";
import React from "react";
import { View, Modal } from "react-native";

interface IModalSolidProps {
    theme: IOrderPickerThemeColors;
    children: JSX.Element;
    visible: boolean;
}

export const ModalSolid = React.memo(({ theme, children, visible }: IModalSolidProps) => {
    return (
        <>
            {
                !!theme &&
                <Modal
                    animationType="slide"
                    visible={visible}
                    presentationStyle="fullScreen"
                    statusBarTranslucent={true}
                >
                    <View style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: theme.common.modal.backgroundColor,
                    }}>
                        <View style={{
                            margin: 40,
                            backgroundColor: theme.common.modal.window.backgroundColor,
                            borderRadius: 8,
                            padding: 44,
                            alignItems: "center",
                        }}>
                            {
                                children
                            }
                        </View>
                    </View>
                </Modal>
            }
        </>
    );
})