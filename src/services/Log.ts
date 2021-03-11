import { NativeLog } from "../native/Log";

export class Log {
    static i(tag: string, message: string) {
        console.warn(tag, message);
        NativeLog.i(tag, message);
    }
}