import {
    NativeModules
} from "react-native";

interface INativeLog {
    i: (tag: string, message: string) => Promise<void>;
}

export const NativeLog: INativeLog = NativeModules.Log;
