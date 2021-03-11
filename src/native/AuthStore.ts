import {
    NativeModules
} from "react-native";

interface IAuthStore {
    getToken: (serialNumber: string, salt: string) => Promise<string>;
}

export const AuthStore: IAuthStore = NativeModules.AuthStore;
