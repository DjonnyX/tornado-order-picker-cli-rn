import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";
import svgs from "./svgs";
import Svg from "react-native-svg";

interface IIconsProps {
    name?: string;
    svgs: any;
    width: number | string;
    height: number | string;
    viewBox?: string;
    defaultViewBox?: string;
    style: StyleProp<ViewStyle>;
    fill: string,
    fillRule: string,
    stroke: string,
    strokeWidth: number | string | undefined;
}

const SvgIcon = (props: IIconsProps): JSX.Element | null => {
    if (!props.name) {
        return null;
    }

    const name = props.svgs[`${props.name}.${Platform.OS}`] || props.svgs[props.name];

    if (!name) {
        return null;
    }

    const height = props.height && props.height.toString();
    const width = props.width && props.width.toString();
    const strokeWidth = props.strokeWidth && props.strokeWidth.toString();

    const isSimple = React.isValidElement(name);
    const svgEl = isSimple ? name : name.svg;

    let viewBox;

    if (props.viewBox && props.viewBox !== SvgIcon.defaultProps.viewBox) {
        viewBox = props.viewBox;
    }
    else if (!isSimple && name.viewBox) {
        viewBox = name.viewBox;
    }
    else if (props.defaultViewBox) {
        viewBox = props.defaultViewBox;
    }
    else {
        viewBox = SvgIcon.defaultProps.viewBox;
    }

    return (
        <Svg height={height} width={width} viewBox={viewBox} style={props.style}>
            {React.cloneElement(svgEl, {
                fill: props.fill,
                fillRule: props.fillRule,
                stroke: props.stroke,
                strokeWidth: strokeWidth
            })}
        </Svg>
    );
}

SvgIcon.defaultProps = {
    fill: "#000",
    fillRule: "evenodd",
    height: "32",
    width: "32",
    viewBox: "0 0 32 32"
};

/**
 * Use:
 * <Icons name="Person" fill={color} />
 */
export const Icons = (props: {
    name: string;
    fill: string | number;
    width?: number | string;
    height?: number | string;
    [x: string]: any;
}) => {
    return <SvgIcon {...props as any} svgs={svgs} />
}