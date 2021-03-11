import React, { useState, useCallback, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import DropShadow from "react-native-drop-shadow";
import { ICompiledLanguage } from "@djonnyx/tornado-types";
import { theme } from "../../theme";
import { uiutils } from "../../utils/ui";
import { ModalSolid } from "./ModalSolid";

interface ILanguagePickerProps {
    languages: Array<ICompiledLanguage>;
    language: ICompiledLanguage;
    onSelect: (lang: ICompiledLanguage) => void;
}

export const LanguagePicker = React.memo(({ language, languages, onSelect }: ILanguagePickerProps) => {
    const [currentLanguage, _setCurrentLanguage] = useState(language);
    const [modalVisible, _setModalVisible] = useState(false);

    const shadow = uiutils.createShadow(theme.themes[theme.name].languagePicker.borderColor, 1, 0.45);

    useEffect(() => {
        _setCurrentLanguage(language);
    }, [language]);

    const onPressHandler = useCallback(() => {
        _setModalVisible(true);
    }, []);

    const onSelectHandler = useCallback((lang: ICompiledLanguage) => {
        _setModalVisible(false);
        onSelect(lang);
    }, []);

    return (
        <View style={{ justifyContent: "center", alignItems: "center", height: 48 }}>
            <ModalSolid visible={modalVisible}>
                <FlatList style={{ flexGrow: 0, padding: 12 }} data={languages} renderItem={({ item }) => {
                    return <TouchableOpacity onPress={() => {
                        onSelectHandler(item);
                    }}>
                        <View style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
                            <FastImage style={{
                                width: 128, height: 128, borderWidth: 1,
                                borderColor: theme.themes[theme.name].languageModal.item.borderColor,
                                borderRadius: 16, marginBottom: 8
                            }} source={{
                                uri: `file://${item?.resources?.main?.path}`,
                            }} resizeMode={FastImage.resizeMode.cover}></FastImage>
                            <Text style={{
                                fontSize: 16, fontWeight: "bold",
                                color: theme.themes[theme.name].languageModal.item.textColor
                            }}>
                                {
                                    item?.name
                                }
                            </Text>
                        </View>
                    </TouchableOpacity>
                }}>
                </FlatList>
            </ModalSolid>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}
                onPress={onPressHandler}>
                <DropShadow style={shadow}>
                    <View style={{
                        flexDirection: "row", alignItems: "center", justifyContent: "center", padding: 8, overflow: "hidden",
                        width: 44, height: 44, borderRadius: 32
                    }}>
                        <FastImage style={{ position: "absolute", width: 64, height: 64 }} source={{
                            uri: `file://${currentLanguage?.resources?.main?.mipmap.x128}`,
                        }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                    </View>
                </DropShadow>
            </TouchableOpacity>
        </View>
    );
})