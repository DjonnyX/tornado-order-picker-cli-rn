import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { BehaviorSubject, from, forkJoin, of, Subject } from "rxjs";
import { take, takeUntil, filter } from "rxjs/operators";
import { IAsset, ICompiledData, IRefs } from "@djonnyx/tornado-types";
import { AssetsStore, IAssetsStoreResult } from "@djonnyx/tornado-assets-store";
import { DataCombiner } from "@djonnyx/tornado-refs-processor";
import { ExternalStorage } from "../native";
import { config } from "../Config";
import { assetsService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { CapabilitiesSelectors, SystemSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";

interface IDataCollectorServiceProps {
    // store
    _onChange: (data: ICompiledData) => void;
    _onProgress: (progress: IProgress) => void;

    // self
    _serialNumber?: string | undefined;
    _terminalId?: string | undefined;
    _storeId?: string | undefined;
    _currentScreen?: string | undefined;
}

interface IDataCollectorServiceState { }

const COMPILED_DATA_FILE_NAME = "refs.json";

class DataCollectorServiceContainer extends Component<IDataCollectorServiceProps, IDataCollectorServiceState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _assetsStore: AssetsStore | null = null;

    private _dataCombiner: DataCombiner | null = null;

    private _savedData: IRefs | undefined;

    private _isLoadingStarted = false;

    private _serialNumber$ = new BehaviorSubject<string | undefined>(undefined);
    public readonly serialNumber$ = this._serialNumber$.asObservable();

    constructor(props: IDataCollectorServiceProps) {
        super(props);
    }

    async componentDidMount() {
        let userDataPath: string | undefined = undefined;

        try {
            const isStorageAvailable = await ExternalStorage.isStorageAvailable();
            const isStorageWritable = await ExternalStorage.isStorageWritable();

            if (isStorageAvailable && !isStorageWritable) {
                userDataPath = await ExternalStorage.getPath();
            }
        } catch (err) {
            console.warn(err);
            return;
        }

        const storePath = `${userDataPath}/assets`;
        
        try {
            if (!await assetsService.exists(storePath)) {
                await assetsService.mkdir(storePath);
            }
        } catch (err) {
            console.warn(err, storePath);
        }

        try {
            this._savedData = await assetsService.readFile(`${storePath}/${COMPILED_DATA_FILE_NAME}`);
        } catch (err) {
            console.warn("Saved data not found.");
        }

        this._assetsStore = new AssetsStore(storePath, assetsService, {
            createDirectoryRecurtion: false,
            maxThreads: 1,
        });

        this._dataCombiner = new DataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
                return this._assetsStore?.setManifest(assets) || {
                    onComplete: of(assets),
                    onProgress: of({ total: 0, current: 0 }),
                } as IAssetsStoreResult;
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._dataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                assetsService.writeFile(`${storePath}/${COMPILED_DATA_FILE_NAME}`, data.refs.__raw);
                this.props._onChange(data);
            },
        );

        this._dataCombiner.onProgress.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            progress => {
                this.props._onProgress(progress);
            },
        );
    }

    load(): void {
        if (this._isLoadingStarted) {
            return;
        }

        if (!this._assetsStore) {
            return;
        }

        this._isLoadingStarted = true;

        forkJoin([
            from(
                this._assetsStore.init(),
            ),
            this._serialNumber$.pipe(
                // filter(s => s !== undefined),
                take(1), // Если серийник поменяется, нужно чистить базу
            ),
        ]).pipe(
            take(1),
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(() => {
            this._dataCombiner?.init(this.props._storeId as string, this._savedData as any);
        });
    }

    shouldComponentUpdate(nextProps: Readonly<IDataCollectorServiceProps>, nextState: Readonly<IDataCollectorServiceState>, nextContext: any) {
        if (this.props._serialNumber !== nextProps._serialNumber) {
            this._serialNumber$.next(this.props._serialNumber);
        }

        if (nextProps._currentScreen === MainNavigationScreenTypes.LOADING && !!nextProps._storeId) {
            this.load();
        }

        if (super.shouldComponentUpdate) return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        return true;
    }

    componentWillUnmount() {
        if (!!this._dataCombiner) {
            this._dataCombiner.dispose();
            this._dataCombiner = null;
        }

        if (!!this._assetsStore) {
            this._assetsStore.dispose();
            this._assetsStore = null;
        }

        if (!!this._unsubscribe$) {
            this._unsubscribe$.next();
            this._unsubscribe$.complete();
            this._unsubscribe$ = null;
        }
    }

    render() {
        return <></>;
    }
}

const mapStateToProps = (state: IAppState) => {
    return {
        _serialNumber: SystemSelectors.selectSerialNumber(state),
        _terminalId: SystemSelectors.selectTerminalId(state),
        _storeId: SystemSelectors.selectStoreId(state),
        _currentScreen: CapabilitiesSelectors.selectCurrentScreen(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onChange: (data: ICompiledData) => {
            dispatch(CombinedDataActions.setData(data));
            dispatch(CapabilitiesActions.setLanguage(data.refs.defaultLanguage));
            dispatch(CapabilitiesActions.setOrderType(data.refs.defaultOrderType));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const DataCollectorService = connect(mapStateToProps, mapDispatchToProps)(DataCollectorServiceContainer);