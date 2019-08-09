"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var event_1 = require("./event");
/**
 * Fired when a player requests cards from the draw pile.
 */
var BeforeDrawEvent = /** @class */ (function (_super) {
    __extends(BeforeDrawEvent, _super);
    /**
     * @param {Player} player  thatThe player will draw
     * @param {number} quantity The quantity of cards will be drawn
     */
    function BeforeDrawEvent(player, quantity) {
        var _this = _super.call(this, 'beforedraw') || this;
        _this.player = player;
        _this.quantity = quantity;
        return _this;
    }
    return BeforeDrawEvent;
}(event_1.Event));
exports.BeforeDrawEvent = BeforeDrawEvent;
/**
 * Fired after player's drawn cards are added to his hands.
 */
var DrawEvent = /** @class */ (function (_super) {
    __extends(DrawEvent, _super);
    /**
     * @param {Player} player The player that has drawn
     * @param {Card[]} cards The cards that were drawn
     */
    function DrawEvent(player, cards) {
        var _this = _super.call(this, 'draw') || this;
        _this.player = player;
        _this.cards = cards;
        return _this;
    }
    return DrawEvent;
}(event_1.Event));
exports.DrawEvent = DrawEvent;
/**
 * Fired when a player can pass and requests to pass its turn.
 */
var BeforePassEvent = /** @class */ (function (_super) {
    __extends(BeforePassEvent, _super);
    /**
     * @param {Player} player The player that will pass
     */
    function BeforePassEvent(player) {
        var _this = _super.call(this, 'beforepass') || this;
        _this.player = player;
        return _this;
    }
    return BeforePassEvent;
}(event_1.Event));
exports.BeforePassEvent = BeforePassEvent;
/**
 * Fired before player discards a card in the discard pile.
 */
var BeforeCardPlayEvent = /** @class */ (function (_super) {
    __extends(BeforeCardPlayEvent, _super);
    /**
     * @param {Card} card The card that will be played
     * @param {Player} player The player that will play
     */
    function BeforeCardPlayEvent(card, player) {
        var _this = _super.call(this, 'beforecardplay') || this;
        _this.card = card;
        _this.player = player;
        return _this;
    }
    return BeforeCardPlayEvent;
}(event_1.Event));
exports.BeforeCardPlayEvent = BeforeCardPlayEvent;
/**
 * Fired after player's card is thrown in the discard pile.
 */
var CardPlayEvent = /** @class */ (function (_super) {
    __extends(CardPlayEvent, _super);
    /**
     * @param {Card} card The card that was played
     * @param {Player} player The player that played
     */
    function CardPlayEvent(card, player) {
        var _this = _super.call(this, 'cardplay') || this;
        _this.card = card;
        _this.player = player;
        return _this;
    }
    return CardPlayEvent;
}(event_1.Event));
exports.CardPlayEvent = CardPlayEvent;
/**
 * Fired when {@link game#currentPlayer | currentPlayer} changes.
 */
var NextPlayerEvent = /** @class */ (function (_super) {
    __extends(NextPlayerEvent, _super);
    /**
     * @param {Player} player The new player
     */
    function NextPlayerEvent(player) {
        var _this = _super.call(this, 'nextplayer') || this;
        _this.player = player;
        return _this;
    }
    return NextPlayerEvent;
}(event_1.Event));
exports.NextPlayerEvent = NextPlayerEvent;
/**
 * Fired when `winner` has 0 cards at hand.
 */
var GameEndEvent = /** @class */ (function (_super) {
    __extends(GameEndEvent, _super);
    /**
     * @param {Player} winner The big winner
     * @param {number} score Player's final score
     */
    function GameEndEvent(winner, score) {
        var _this = _super.call(this, 'end', {
            isCancelable: false,
        }) || this;
        _this.winner = winner;
        _this.score = score;
        return _this;
    }
    return GameEndEvent;
}(event_1.Event));
exports.GameEndEvent = GameEndEvent;
//# sourceMappingURL=game-events.js.map