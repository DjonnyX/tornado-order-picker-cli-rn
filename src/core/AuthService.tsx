import React, { Component, Dispatch } from "react";
import { connect } from "react-redux";
import { Subject } from "rxjs";
import { IProgress } from "@djonnyx/tornado-refs-processor/dist/DataCombiner";
import { ExternalStorage } from "../native";
import { assetsService, orderApiService, refApiService } from "../services";
import { IAppState } from "../store/state";
import { CombinedDataActions } from "../store/actions";
import { SystemActions } from "../store/actions/SystemAction";
import { SystemSelectors } from "../store/selectors";
import { IDeviceInfo } from "./interfaces";

interface IAuthServiceProps {
    // store
    _onChangeDeviceInfo: (deviceInfo: IDeviceInfo | null) => void;

    // self
    _serialNumber: string | undefined;
    _terminalId: string | undefined;
    _storeId: string | undefined;
    _setupStep: number;
}

interface IAuthServiceState { }

const DEVICE_INFO = "device.json";

class AuthServiceContainer extends Component<IAuthServiceProps, IAuthServiceState> {
    private _unsubscribe$: Subject<void> | null = new Subject<void>();

    private _deviceInfo: IDeviceInfo | null = null;

    private _storePath: string | undefined = undefined;

    constructor(props: IAuthServiceProps) {
        super(props);
    }

    private async saveDeviceInfo(deviceInfo: IDeviceInfo): Promise<void> {
        try {
            await assetsService.writeFile(`${this._storePath}/${DEVICE_INFO}`, deviceInfo);
        } catch (err) {
            // etc
        }
    }

    shouldComponentUpdate(nextProps: Readonly<IAuthServiceProps>, nextState: Readonly<IAuthServiceState>, nextContext: any) {
        if (this.props._serialNumber !== nextProps._serialNumber
            || this.props._setupStep !== nextProps._setupStep
            || this.props._terminalId !== nextProps._terminalId
            || this.props._storeId !== nextProps._storeId) {

            refApiService.serial = orderApiService.serial = nextProps._serialNumber || "";

            if (nextProps._serialNumber !== null && nextProps._serialNumber !== undefined) {
                this.saveDeviceInfo({
                    ...this._deviceInfo,
                    serialNumber: nextProps._serialNumber,
                    terminalId: nextProps._terminalId,
                    storeId: nextProps._storeId,
                    setupStep: nextProps._setupStep,
                });
            }
        }

        if (super.shouldComponentUpdate) return super.shouldComponentUpdate(nextProps, nextState, nextContext);
        return true;
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

        this._storePath = `${userDataPath}/system`;

        try {
            if (!await assetsService.exists(this._storePath)) {
                await assetsService.mkdir(this._storePath);
            }
        } catch (err) {
            console.warn(err, this._storePath);
        }

        try {
            this._deviceInfo = await assetsService.readFile(`${this._storePath}/${DEVICE_INFO}`);
        } catch (err) {
            console.warn("DeviceInfo not found.");
        }

        this.props._onChangeDeviceInfo(this._deviceInfo);
    }

    componentWillUnmount() {
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
        _setupStep: SystemSelectors.selectSetupStep(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        _onChangeDeviceInfo: (data: IDeviceInfo | null) => {
            dispatch(SystemActions.setSerialNumber(data?.serialNumber));
            dispatch(SystemActions.setSetupStep(data?.setupStep || 0));
            dispatch(SystemActions.setTerminalId(data?.terminalId));
            dispatch(SystemActions.setStoreId(data?.storeId));
        },
        _onProgress: (progress: IProgress) => {
            dispatch(CombinedDataActions.setProgress(progress));
        },
    };
};

export const AuthService = connect(mapStateToProps, mapDispatchToProps)(AuthServiceContainer);