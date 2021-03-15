import { ICompiledOrder } from "@djonnyx/tornado-types";

export interface IOrdersState {
    version: number;
    collection: Array<ICompiledOrder>;
}
