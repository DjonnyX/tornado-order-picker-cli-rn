import React from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import { ICompiledLanguage, ICompiledTag } from "@djonnyx/tornado-types";

interface ITagListProps {
    language: ICompiledLanguage;
    tags: Array<ICompiledTag>;
}

export const TagList = React.memo(({ tags, language }: ITagListProps) => {

    return (<View style={{ width: "100%", flexDirection: "row", flexWrap: "wrap" }}>
        {
            tags?.map(tag =>
                tag?.contents[language.code]?.resources?.main?.mipmap?.x32
                    ?
                    <FastImage key={tag.id} style={{ width: 24, height: 24 }} source={{
                        uri: `file://${tag?.contents[language.code]?.resources?.main?.mipmap?.x32}`,
                    }} resizeMode={FastImage.resizeMode.contain}></FastImage>
                    :
                    <View key={tag.id} style={{
                        width: 8, height: 8, marginRight: 2,
                        backgroundColor: tag?.contents[language.code]?.color, borderRadius: 4
                    }}></View>
            )
        }
    </View>
    );
});