import {
    NativeModules
} from "react-native";

interface IExternalStorage {
    getPath: () => Promise<string>;
    isStorageAvailable: () => Promise<boolean>;
    isStorageWritable: () => Promise<boolean>;
    downloadFile: (url: string, outputPath: string) => Promise<void>;
    writeFile: (filePath: string, data: string) => Promise<void>;
    readFile: (filePath: string) => Promise<string>;
    exists: (pPath: string) => Promise<boolean>;
    unlink: (path: string) => Promise<void>;
    mkdir: (path: string) => Promise<void>;
}

export const ExternalStorage: IExternalStorage = NativeModules.ExternalStorage;
