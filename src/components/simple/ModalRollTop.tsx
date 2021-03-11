import React from "react";
import { View, Modal } from "react-native";
import { theme } from "../../theme";

interface IModalRollTopProps {
    children: JSX.Element;
    visible: boolean;
}

export const ModalRollTop = React.memo(({ children, visible }: IModalRollTopProps) => {
    return (
        <Modal
            animationType="slide"
            visible={visible}
            presentationStyle="overFullScreen"
            transparent={true}
            statusBarTranslucent={true}
        >
            <View style={{
                flex: 1,
                justifyContent: "flex-end",
                alignItems: "center",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                //backgroundColor: "#ffffff",//theme.themes[theme.name].common.modalTransparent.background,
            }}>
                <View style={{
                    width: "100%",
                    height: "100%",
                    //borderWidth: 1,
                    //borderColor: theme.themes[theme.name].common.modalTransparent.window.borderColor,
                    backgroundColor: theme.themes[theme.name].common.modalTransparent.window.background,
                    alignItems: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 8,
                }}>
                    {
                        children
                    }
                </View>
            </View>
        </Modal>
    );
})