import { EventEmitter } from 'events';
import { Event } from './event';
export declare class CancelableEventEmitter extends EventEmitter {
    on(eventName: string, listener: Function): this;
    emit(type: string, data?: any): boolean;
    /**
     * @param {Event} event
     */
    dispatchEvent(event: Event): boolean;
}
