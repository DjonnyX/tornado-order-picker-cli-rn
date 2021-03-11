import React from "react";
import { Defs, G, Circle, Path, Polygon, Rect, Stop } from "react-native-svg";

export default {
    Menu: {
        svg: <G fill="#435761">
            <Circle cx="5" cy="4" r="2" />
            <Circle cx="12" cy="4" r="2" />
            <Circle cx="19" cy="4" r="2" />
            <Circle cx="5" cy="12" r="2" />
            <Circle cx="12" cy="12" r="2" />
            <Circle cx="19" cy="12" r="2" />
            <Circle cx="5" cy="20" r="2" />
            <Circle cx="12" cy="20" r="2" />
            <Circle cx="19" cy="20" r="2" />
        </G>,
        viewBox: "0 0 24 24"
    },
    ArrLeft: {
        svg: <Path fill-rule="evenodd" clip-rule="evenodd" d="M15.4 7.4L14 6L8 12L14 18L15.4 16.6L10.8 12L15.4 7.4Z" fill="black" fill-opacity="0.54" />,
        viewBox: "0 0 24 24"
    },
    ArrDropUp: {
        svg: <Polygon points="8.6,0 17.3,8.6 15.2,10.8 8.6,4.3 2.1,10.8 0,8.6 " />,
        viewBox: "0 0 48 48"
    },
    ArrDropDown: {
        svg: <Polygon points="9,15.51 0.36,6.87 2.49,4.75 9,11.27 15.51,4.75 17.64,6.87" />,
        viewBox: "0 0 48 48"
    },
    ArrRight: {
        svg: <Path fill-rule="evenodd" clip-rule="evenodd" d="M8.6001 7.4L10.0001 6L16.0001 12L10.0001 18L8.6001 16.6L13.2001 12L8.6001 7.4Z" fill="black" fill-opacity="0.54" />,
        viewBox: "0 0 24 24"
    },
    Person: {
        svg: <Path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 3.25C10.53 3.25 3.25 10.53 3.25 19.5C3.25 28.47 10.53 35.75 19.5 35.75C28.47 35.75 35.75 28.47 35.75 19.5C35.75 10.53 28.47 3.25 19.5 3.25ZM19.5 8.125C22.1975 8.125 24.375 10.3025 24.375 13C24.375 15.6975 22.1975 17.875 19.5 17.875C16.8025 17.875 14.625 15.6975 14.625 13C14.625 10.3025 16.8025 8.125 19.5 8.125ZM9.75 25.9675C11.8463 29.12 15.4375 31.2 19.5 31.2C23.5625 31.2 27.1537 29.12 29.25 25.9675C29.2012 22.7337 22.7337 20.9625 19.5 20.9625C16.25 20.9625 9.79875 22.7337 9.75 25.9675Z" fill="black" fill-opacity="0.54" />,
        viewBox: "0 0 40 40"
    },
    Close: {
        svg: <Polygon points="37.01,6.59 31.41,0.99 19,13.4 6.59,0.99 0.99,6.59 13.4,19 0.99,31.41 6.59,37.01 19,24.6 31.41,37.01 37.01,31.41 24.6,19 " />,
        viewBox: "0 0 38 38"
    }
}