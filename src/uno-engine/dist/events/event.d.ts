export interface EventOptions {
    /**
     * @default false
     */
    isCancelable: boolean;
}
export declare class Event {
    private _type;
    private _isCancelable;
    private _canceled;
    readonly type: string;
    readonly isCancelable: boolean;
    readonly canceled: boolean;
    constructor(type: string, options?: Partial<EventOptions>);
    preventDefault(): void;
}
