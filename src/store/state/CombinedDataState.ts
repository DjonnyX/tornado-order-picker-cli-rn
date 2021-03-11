import { ICompiledData } from "@djonnyx/tornado-types";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";

export interface ICombinedDataState {
    data: ICompiledData | null;
    progress: IProgress;
}