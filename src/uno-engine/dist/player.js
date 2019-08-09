"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(name) {
        this.hand = [];
        name = !!name ? name.trim() : name;
        if (!name)
            throw new Error('Player must have a name');
        this.name = name;
    }
    Player.prototype.getCardByValue = function (value) {
        if (!value)
            return undefined;
        return this.hand.find(function (c) { return c.value === value; });
    };
    Player.prototype.hasCard = function (card) {
        if (!card)
            return false;
        return this.hand.some(function (c) { return c.value === card.value && c.color === card.color; });
    };
    Player.prototype.removeCard = function (card) {
        if (!this.hasCard(card))
            return;
        var i = this.hand.findIndex(function (c) { return c.value === card.value && c.color === card.color; });
        this.hand.splice(i, 1);
    };
    Player.prototype.valueOf = function () {
        return this.name;
    };
    Player.prototype.toString = function () {
        return this.name;
    };
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map