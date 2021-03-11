import { Observable, from, throwError, of } from "rxjs";
import { catchError, map, retryWhen, switchMap } from "rxjs/operators";
import { config } from "../Config";
import { IOrder } from "@djonnyx/tornado-types";
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

export interface IOrderData {
    sum: number;
    discount: number;
    currencyId: string;
    orderTypeId: string;
    positions: Array<IOrderPositionData>;
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

class OrderApiService {
    private _serial: string | undefined;

    public set serial(v: string) {
        if (this._serial === v) {
            return;
        }

        this._serial = v;
    }

    async getAccessToken(options?: IApiRequestOptions): Promise<string> {
        return AuthStore.getToken(options?.serial || this._serial || "", config.orderServer.apiKeyTokenSalt);
    }

    sendOrder(orderData: IOrderData): Observable<IOrder> {
        Log.i("OrderApiService", "sendOrder");
        return request(
            from(this.getAccessToken()).pipe(
                switchMap(token => {
                    return from(
                        fetch(`${config.orderServer.address}/api/v1/order`,
                            {
                                method: "POST",
                                headers: {
                                    "x-access-token": token,
                                    "content-type": "application/json",
                                },
                                body: JSON.stringify(orderData),
                            }
                        )
                    );
                }),
            ),
        ).pipe(
            switchMap(res => parseResponse(res)),
            catchError(err => {
                Log.i("OrderApiService", "> sendOrder: " + err);
                return throwError(err);
            }),
            map(resData => resData.data)
        );
    }
}

export const orderApiService = new OrderApiService();