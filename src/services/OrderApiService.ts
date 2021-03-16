import { Observable, from, throwError, of } from "rxjs";
import { catchError, map, retryWhen, switchMap } from "rxjs/operators";
import { IOrder, IRef, OrderPositionStatuses, OrderStatuses } from "@djonnyx/tornado-types";
import { IDataService } from "@djonnyx/tornado-order-refs-processor";
import { config } from "../Config";
import { genericRetryStrategy } from "../utils/request";
import { Log } from "./Log";
import { AuthStore } from "../native";
import { extractError } from "../utils/error";
import { ApiErrorCodes } from "./ApiErrorCodes";

export interface IOrderPositionData {
    productId: string;
    price: number;
    sum: number;
    discount: number;
    quantity: number;
    children: Array<IOrderPositionData>;
}

interface IRequestOptions {
    useAttempts?: boolean;
    breakAfter?: number;
}

interface IApiRequestOptions {
    serial?: string;
}

const request = (observable: Observable<Response>, options?: IRequestOptions): Observable<Response> => {
    if (options?.useAttempts) {
        return observable.pipe(
            retryWhen(
                genericRetryStrategy({
                    rejectShortAttempts: 5, // 5 последовательных попыток
                    rejectShortTimeout: 5000, // Раз в 5 сек
                    rejectLongTimeout: 60000, // Раз в минуту переобновление
                    excludedStatusCodes: [],
                }),
            ),
        );
    }

    return observable;
}

const parseResponse = (res: Response) => {
    return from(res.json()).pipe(
        catchError(err => {
            switch (res.status) {
                case 401:
                    return throwError("Некорректная лицензия.");
                case 504:
                    return throwError("Ошибка в соединении.");
                default:
                    return throwError("Неизвестная ошибка.");
            }
        }),
        switchMap(data => {
            if (!!data.error && data.error.length > 0) {
                let errText = "";
                switch (data.error[0].code) {
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_CHECK_LICENSE_ERROR:
                        errText = "Ошибка при проверке лицензии";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_METHOD_NOT_ALLOWED:
                        errText = "Метод не доступен";
                        break;
                    case ApiErrorCodes.REF_CLIENT_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_EMPTY_TOKEN:
                        errText = "Токен не задан";
                        break;
                    case ApiErrorCodes.LIC_ACCOUNT_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_EMPTY_TOKEN:
                    case ApiErrorCodes.LIC_INTERNAL_TOKEN_VERIFICATION:
                        errText = "Внутренняя ошибка сервера";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_FINISHED:
                        errText = "Срок действия лицензии прошел";
                        break;
                    case ApiErrorCodes.LIC_LICENSE_NOT_FOUND:
                        errText = "Лицензия не найдена";
                        break;
                    case ApiErrorCodes.REF_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_BAD_FORMAT:
                    case ApiErrorCodes.LIC_TERMINAL_TOKEN_VERIFICATION:
                        errText = "Ошибка подлинности токена";
                        break;
                    default: {
                        return throwError(extractError(data.error) || `Неизвестная ошибка (${data.error[0].code})`);
                    }
                }
                return throwError(`${errText} (${data.error[0].code})`);
            }

            return of(data);
        }),
    );
}

class OrderApiService implements IDataService {
    private _serial: string | undefined;

    public set serial(v: string) {
        if (this._serial === v) {
            return;
        }

        this._serial = v;
    }

    private _storeId: string | undefined;

    public set storeId(v: string) {
        if (this._storeId === v) {
            return;
        }

        this._storeId = v;
    }

    async getAccessToken(options?: IApiRequestOptions): Promise<string> {
        return AuthStore.getToken(options?.serial || this._serial || "", config.orderServer.apiKeyTokenSalt);
    }

    getRefs(): Observable<Array<IRef>> {
        Log.i("OrderApiService", "getOrderRefs");
        let response: Observable<Array<IRef>>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.orderServer.address}/api/v1/refs`,
                                {
                                    method: "GET",
                                    headers: {
                                        "x-access-token": token,
                                        "content-type": "application/json",
                                    },
                                }
                            )
                        );
                    }),
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                catchError(err => {
                    Log.i("OrderApiService", "> getOrderRefs: " + err);
                    return throwError(err);
                }),
                map(resData => resData.data)
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getOrders(): Observable<Array<IOrder>> {
        Log.i("OrderApiService", "getOrders");
        let response: Observable<Array<IOrder>>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.orderServer.address}/api/v1/orders?storeId.equals=${this._storeId}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "x-access-token": token,
                                        "content-type": "application/json",
                                    },
                                }
                            )
                        );
                    }),
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                catchError(err => {
                    Log.i("OrderApiService", "> getOrders: " + err);
                    return throwError(err);
                }),
                map(resData => resData.data)
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    getOrder(id: string): Observable<IOrder> {
        Log.i("OrderApiService", "getOrder");
        let response: Observable<IOrder>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.orderServer.address}/api/v1/order/${id}`,
                                {
                                    method: "GET",
                                    headers: {
                                        "x-access-token": token,
                                        "content-type": "application/json",
                                    },
                                }
                            )
                        );
                    }),
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                catchError(err => {
                    Log.i("OrderApiService", "> getOrder: " + err);
                    return throwError(err);
                }),
                map(resData => resData.data)
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    changeOrderStatus(id: string, status: OrderStatuses): Observable<{
        meta: {
            ref: IRef,
        },
        data: IOrder,
    }> {
        Log.i("OrderApiService", "changeOrderStatus");
        let response: Observable<{
            meta: {
                ref: IRef,
            },
            data: IOrder,
        }>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.orderServer.address}/api/v1/order/${id}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "x-access-token": token,
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({ status }),
                                }
                            )
                        );
                    }),
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                catchError(err => {
                    Log.i("OrderApiService", "> changeOrderStatus: " + err);
                    return throwError(err);
                }),
                map(resData => resData)
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }

    changeOrderPositionStatus(id: string, positionId: string, status: OrderPositionStatuses): Observable<{
        meta: {
            ref: IRef,
        },
        data: IOrder,
    }> {
        Log.i("OrderApiService", "changeOrderPositionStatus");
        let response: Observable<{
            meta: {
                ref: IRef,
            },
            data: IOrder,
        }>;
        try {
            response = request(
                from(this.getAccessToken()).pipe(
                    switchMap(token => {
                        return from(
                            fetch(`${config.orderServer.address}/api/v1/order/${id}/position/${positionId}`,
                                {
                                    method: "PUT",
                                    headers: {
                                        "x-access-token": token,
                                        "content-type": "application/json",
                                    },
                                    body: JSON.stringify({ status }),
                                }
                            )
                        );
                    }),
                ),
            ).pipe(
                switchMap(res => parseResponse(res)),
                catchError(err => {
                    Log.i("OrderApiService", "> changeOrderPositionStatus: " + err);
                    return throwError(err);
                }),
                map(resData => resData)
            );
        } catch (err) {
            return throwError(Error("Something went wrong"));
        }
        return response;
    }
}

export const orderApiService = new OrderApiService();