import { IOrderPickerThemeColors } from "@djonnyx/tornado-types";
import React from "react";
import { View, Modal } from "react-native";

interface IModalTransparentProps {
    theme: IOrderPickerThemeColors;
    children: JSX.Element;
    visible: boolean;
}

export const ModalTransparent = React.memo(({ theme, children, visible }: IModalTransparentProps) => {
    return (
        <>
            {
                !!theme &&
                <Modal
                    animationType="slide"
                    visible={visible}
                    presentationStyle="overFullScreen"
                    transparent={true}
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
                        backgroundColor: theme.common.modalTransparent.backgroundColor,
                    }}>
                        <View style={{
                            margin: 40,
                            borderWidth: 0,
                            borderColor: theme.common.modalTransparent.window.borderColor,
                            backgroundColor: theme.common.modalTransparent.window.backgroundColor,
                            borderRadius: 8,
                            padding: 44,
                            alignItems: "center",
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 2,
                            },
                            shadowOpacity: 0.05,
                            shadowRadius: 8.84,
                            elevation: 8,
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