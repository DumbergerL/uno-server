"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var values_1 = require("./values");
var Card = /** @class */ (function () {
    function Card(value, color) {
        this._value = value;
        this._color = color === undefined ? undefined : color;
        if (!this.isWildCard() && this.color === undefined) {
            throw Error('Only wild cards can be initialized with no color');
        }
    }
    Object.defineProperty(Card.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (color) {
            if (!this.isWildCard())
                throw new Error('Only wild cards can have theirs colors changed.');
            else if (color < 0 || color > 3)
                throw new Error('The color must be a value from Colors enum.');
            this._color = color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Card.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Card.prototype.isWildCard = function () {
        return this.value === values_1.Values.WILD || this.value === values_1.Values.WILD_DRAW_FOUR;
    };
    Card.prototype.isSpecialCard = function () {
        return (this.isWildCard() ||
            this.value === values_1.Values.DRAW_TWO ||
            this.value === values_1.Values.REVERSE ||
            this.value === values_1.Values.SKIP);
    };
    Card.prototype.matches = function (other) {
        if (this.isWildCard())
            return true;
        else if (this.color === undefined || other.color === undefined)
            throw new Error('Both cards must have theirs colors set before comparing');
        return other.value === this.value || other.color === this.color;
    };
    Object.defineProperty(Card.prototype, "score", {
        get: function () {
            switch (this.value) {
                case values_1.Values.DRAW_TWO:
                case values_1.Values.SKIP:
                case values_1.Values.REVERSE:
                    return 20;
                case values_1.Values.WILD:
                case values_1.Values.WILD_DRAW_FOUR:
                    return 50;
                default:
                    return this.value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Card.prototype.is = function (value, color) {
        var matches = this.value === value;
        if (!!color)
            matches = matches && this.color === color;
        return matches;
    };
    Card.prototype.toString = function () {
        return (this.color || 'NO_COLOR') + " " + this.value;
    };
    return Card;
}());
exports.Card = Card;
//# sourceMappingURL=card.js.map