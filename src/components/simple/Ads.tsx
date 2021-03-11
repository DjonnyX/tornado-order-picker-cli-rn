import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, GestureResponderEvent } from "react-native";
import FastImage from 'react-native-fast-image'
import Video from "react-native-video";
import { ICompiledAd } from "@djonnyx/tornado-types/dist/interfaces/ICompiledAd";
import { ICompiledLanguage, AssetExtensions } from "@djonnyx/tornado-types";

interface IAdsProps {
    menuStateId: number;
    ads: Array<ICompiledAd>;
    language: ICompiledLanguage;
    onPress: (ad: ICompiledAd) => void;
}

export const Ads = React.memo(({ menuStateId, language, ads, onPress }: IAdsProps) => {
    const [currentAdIndex, _setCurrentAdIndex] = useState(0);

    const nextCurrentAdIndex = () => {
        _setCurrentAdIndex(prevAdIndex => {
            if (ads.length > 1) {
                if (prevAdIndex + 1 > ads.length - 1) {
                    prevAdIndex = 0;
                } else {
                    prevAdIndex += 1;
                }
            }
            return prevAdIndex;
        });
    };

    const updateTimerOfDuration = (duration = 0) => {
        if (duration > 0) {
            setTimeout(nextCurrentAdIndex, duration * 1000);
        }
    };

    const pressHandler = useCallback((e: GestureResponderEvent) => {
        if (!!onPress) {
            onPress(ads[currentAdIndex]);
        }
    }, [currentAdIndex]);

    const currentAdContent = !!ads && ads.length > 0 && !!ads[currentAdIndex] ? ads[currentAdIndex].contents[language?.code] : undefined;
    const currentAdAsset = currentAdContent?.resources?.main;

    const isVideo = currentAdAsset?.ext === AssetExtensions.MP4;

    if (!isVideo) {
        updateTimerOfDuration(currentAdContent?.duration || 0);
    }

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
            <TouchableOpacity style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }} onPress={pressHandler}>
                {
                    !!currentAdAsset
                        ?
                        isVideo
                            ?
                            <Video style={{ width: "100%", height: "100%" }} resizeMode={"cover"} source={{
                                uri: `file://${currentAdAsset?.path}`,
                            }} controls={false} repeat={true}></Video>
                            :
                            <FastImage style={{ width: "100%", height: "100%" }} source={{
                                uri: `file://${currentAdAsset?.path}`,
                            }} resizeMode={FastImage.resizeMode.cover}></FastImage>
                        :
                        <></>
                }
            </TouchableOpacity>
        </View>
    );
})