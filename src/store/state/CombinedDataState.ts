import { ICompiledData, ICompiledOrderData, ITerminal } from "@djonnyx/tornado-types";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";

export interface ICombinedDataState {
    data: ICompiledData | null;
    terminal: ITerminal | null;
    orderData: ICompiledOrderData | null;
    progress: IProgress;
}