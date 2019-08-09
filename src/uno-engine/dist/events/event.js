"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defaults = {
    isCancelable: true,
};
var Event = /** @class */ (function () {
    function Event(type, options) {
        if (!type)
            throw new Error('Event type is mandatory');
        options = Object.assign({}, defaults, options);
        if (typeof options.isCancelable === 'undefined')
            options.isCancelable = true;
        this._type = type;
        this._isCancelable = options.isCancelable;
        this._canceled = false;
    }
    Object.defineProperty(Event.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "isCancelable", {
        get: function () {
            return this._isCancelable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Event.prototype, "canceled", {
        get: function () {
            return this._canceled;
        },
        enumerable: true,
        configurable: true
    });
    Event.prototype.preventDefault = function () {
        if (this.isCancelable)
            this._canceled = true;
    };
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=event.js.map