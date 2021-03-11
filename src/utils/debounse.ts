export class Debounse {

    private _timer: any;
    
    constructor(private _fn: Function, private _delay: number) {}

    call(...args: any[]) {
        this.reset(args);
    }

    private reset(...args: any[]) {
        clearTimeout(this._timer);
        this._timer = setTimeout(() => {
            this._fn(args);
        }, this._delay);
    }

    dispose() {
        clearTimeout(this._timer);
        (this._fn as any) = null;
    }
}