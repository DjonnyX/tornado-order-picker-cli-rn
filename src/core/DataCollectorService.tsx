import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { BehaviorSubject, from, forkJoin, of, Subject } from "rxjs";
import { take, takeUntil, filter } from "rxjs/operators";
import { IAsset, ICompiledData, ICompiledOrderData, ICompiledOrderType, ICompiledProduct, ICurrency, IRefs } from "@djonnyx/tornado-types";
import { AssetsStore, IAssetsStoreResult } from "@djonnyx/tornado-assets-store";
import { DataCombiner as MenuDataCombiner } from "@djonnyx/tornado-refs-processor";
import { DataCombiner as OrderDataCombiner } from "@djonnyx/tornado-order-refs-processor";
import { ExternalStorage } from "../native";
import { config } from "../Config";
import { assetsService, orderApiService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions, CapabilitiesActions } from "../store/actions";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { CapabilitiesSelectors, SystemSelectors } from "../store/selectors";
import { MainNavigationScreenTypes } from "../components/navigation";

interface IDataCollectorServiceProps {
    // store
    _onChange: (data: ICompiledOrderData) => void;
    _onChangeMenu: (data: ICompiledData) => void;
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

    private _menuDataCombiner: MenuDataCombiner | null = null;

    private _orderDataCombiner: OrderDataCombiner | null = null;

    private _savedData: IRefs | undefined;

    private _isLoadingStarted = false;

    private _serialNumber$ = new BehaviorSubject<string | undefined>(undefined);
    public readonly serialNumber$ = this._serialNumber$.asObservable();

    private _menuRefs: ICompiledData | null = null;

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

        this._orderDataCombiner = new OrderDataCombiner({
            getRefs: () => ({
                products: this._menuRefs?.refs.products as Array<ICompiledProduct>,
                orderTypes: this._menuRefs?.refs.orderTypes as Array<ICompiledOrderType>,
                currencies: this._menuRefs?.refs.__raw.currencies as Array<ICurrency>,
            }),
            dataService: orderApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._orderDataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                this.props._onChange(data);
            }
        );

        this._orderDataCombiner.onProgress.pipe(
            takeUntil(this._unsubscribe$ as any),
        ).subscribe(
            progress => {
                this.props._onProgress(progress);
            },
        );

        this._menuDataCombiner = new MenuDataCombiner({
            assetsTransformer: (assets: Array<IAsset>) => {
                /*return this._assetsStore?.setManifest(assets) || {
                    onComplete: of(assets),
                    onProgress: of({ total: 0, current: 0 }),
                } as IAssetsStoreResult;*/
                return {
                    onComplete: of(assets),
                    onProgress: of({ total: 0, current: 0 }),
                } as IAssetsStoreResult;
            },
            dataService: refApiService,
            updateTimeout: config.refServer.updateTimeout,
        });

        this._menuDataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                assetsService.writeFile(`${storePath}/${COMPILED_DATA_FILE_NAME}`, data.refs.__raw);

                let isNeedLoadOrderRefs = false;
                if (!this._menuRefs) {
                    isNeedLoadOrderRefs = true;
                }

                this._menuRefs = data;

                if (!!this._orderDataCombiner) {
                    if (isNeedLoadOrderRefs) {
                        this._orderDataCombiner.init();
                    } else {
                        this._orderDataCombiner.dependenciesRefs = data;
                    }
                }

                this.props._onChangeMenu(data);
            },
        );

        this._menuDataCombiner.onChange.pipe(
            takeUntil(this._unsubscribe$ as any),
            filter(data => !!data),
        ).subscribe(
            data => {
                assetsService.writeFile(`${storePath}/${COMPILED_DATA_FILE_NAME}`, data.refs.__raw);
                this._menuRefs = data;
                this.props._onChange(data);
            },
        );

        this._menuDataCombiner.onProgress.pipe(
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
            this._menuDataCombiner?.init(this.props._storeId as string, this._savedData as any);
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
        if (!!this._menuDataCombiner) {
            this._menuDataCombiner.dispose();
            this._menuDataCombiner = null;
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
        _onChangeMenu: (data: ICompiledData) => {
            dispatch(CombinedDataActions.setData(data));
            dispatch(CapabilitiesActions.setLanguage(data.refs.defaultLanguage));
            dispatch(CapabilitiesActions.setOrderType(data.refs.defaultOrderType));
        },
        _onChange: (data: ICompiledOrderData) => {
            dispatch(CombinedDataActions.setOrdersData(data));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const DataCollectorService = connect(mapStateToProps, mapDispatchToProps)(DataCollectorServiceContainer);