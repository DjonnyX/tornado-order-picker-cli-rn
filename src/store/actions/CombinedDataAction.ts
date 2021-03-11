import { Action } from "redux";
import { ICompiledData } from "@djonnyx/tornado-types";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";

export enum CombinedDataActionTypes {
    SET_DATA = "TORNADO/combined-data/set-data",
    SET_PROGRESS = "TORNADO/combined-data/set-progress",
}

interface ICombinedDataActionSetData extends Action<CombinedDataActionTypes.SET_DATA> {
    data: ICompiledData | null;
}

interface ICombinedDataActionSetProgress extends Action<CombinedDataActionTypes.SET_PROGRESS> {
    progress: IProgress;
}

export class CombinedDataActions {
    static setData = (data: ICompiledData | null): ICombinedDataActionSetData => ({
        type: CombinedDataActionTypes.SET_DATA,
        data,
    });

    static setProgress = (progress: IProgress): ICombinedDataActionSetProgress => ({
        type: CombinedDataActionTypes.SET_PROGRESS,
        progress,
    });
}

export type TCombinedDataActions = ICombinedDataActionSetData | ICombinedDataActionSetProgress;