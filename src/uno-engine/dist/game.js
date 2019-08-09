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
var card_1 = require("./card");
var deck_1 = require("./deck");
var events_1 = require("./events");
var game_directions_1 = require("./game-directions");
var player_1 = require("./player");
var CARDS_PER_PLAYER = 7;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(playerNames, houseRules) {
        if (houseRules === void 0) { houseRules = []; }
        var _this = _super.call(this) || this;
        _this._players = [];
        // control vars
        /**
         * The player have draw in his turn?
         */
        _this.drawn = false;
        /**
         * Who yelled uno?
         *
         * key: player name
         * value: true/false
         */
        _this.yellers = {};
        _this._players = _this.fixPlayers(playerNames);
        houseRules.forEach(function (rule) { return rule.setup(_this); });
        _this.newGame();
        return _this;
    }
    Game.prototype.newGame = function () {
        var _this = this;
        this.drawPile = new deck_1.Deck();
        this.direction = game_directions_1.GameDirections.CLOCKWISE;
        this._players.forEach(function (p) { return (p.hand = _this.drawPile.draw(CARDS_PER_PLAYER)); });
        // do not start with special cards (REVERSE, DRAW, etc)
        do {
            this._discardedCard = this.drawPile.draw()[0];
        } while (this._discardedCard.isSpecialCard());
        // select starting player
        this._currentPlayer = this._players[getRandomInt(0, this._players.length - 1)];
    };
    Game.prototype.getPlayer = function (name) {
        var player = this._players[this.getPlayerIndex(name)];
        if (!player)
            return undefined;
        return player;
    };
    Object.defineProperty(Game.prototype, "currentPlayer", {
        get: function () {
            return this._currentPlayer;
        },
        set: function (player) {
            player = this.getPlayer(player.name);
            if (!player)
                throw new Error('The given player does not exist');
            this._currentPlayer = player;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "nextPlayer", {
        get: function () {
            return this.getNextPlayer();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "discardedCard", {
        get: function () {
            return this._discardedCard;
        },
        set: function (card) {
            if (!card)
                return;
            if (card.color === undefined || card.color === null)
                throw new Error('Discarded cards cannot have theirs colors as null');
            this._discardedCard = card;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "players", {
        get: function () {
            return this._players;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "deck", {
        get: function () {
            return this.drawPile;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "playingDirection", {
        get: function () {
            return this.direction;
        },
        set: function (dir) {
            if (dir !== game_directions_1.GameDirections.CLOCKWISE &&
                dir != game_directions_1.GameDirections.COUNTER_CLOCKWISE)
                throw new Error('Invalid direction');
            if (dir !== this.direction)
                this.reverseGame();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @fires Game#beforedraw
     * @fires Game#draw
     */
    Game.prototype.draw = function (player, qty, _a) {
        var silent = (_a === void 0 ? { silent: false } : _a).silent;
        if (arguments.length == 0)
            player = this._currentPlayer;
        qty = qty || 1;
        if (!silent && !this.dispatchEvent(new events_1.BeforeDrawEvent(player, qty)))
            return;
        var drawnCards = this.privateDraw(player, qty);
        if (!silent && !this.dispatchEvent(new events_1.DrawEvent(player, drawnCards)))
            return;
        this.drawn = true;
        // reset UNO! yell state
        this.yellers[player.name] = false;
    };
    /**
     * @fires Game#beforepass
     * @fires Game#nextplayer
     */
    Game.prototype.pass = function () {
        if (!this.drawn)
            throw new Error(this._currentPlayer + " must draw at least one card before passing");
        if (!this.dispatchEvent(new events_1.BeforePassEvent(this._currentPlayer)))
            return;
        this.goToNextPlayer();
    };
    /**
     * @fires Game#beforecardplay
     * @fires Game#cardplay
     * @fires Game#nextplayer
     * @fires Game#end
     */
    Game.prototype.play = function (card, _a) {
        var silent = (_a === void 0 ? { silent: false } : _a).silent;
        var currentPlayer = this._currentPlayer;
        if (!card)
            return;
        // check if player has the card at hand...
        if (!currentPlayer.hasCard(card))
            throw new Error(currentPlayer + " does not have card " + card + " at hand");
        if (!silent &&
            !this.dispatchEvent(new events_1.BeforeCardPlayEvent(card, this._currentPlayer)))
            return;
        if (card.color == undefined)
            throw new Error('Card must have its color set before playing');
        // check if the played card matches the card from the discard pile...
        if (!card.matches(this._discardedCard))
            throw new Error(this._discardedCard + ", from discard pile, does not match " + card);
        currentPlayer.removeCard(card);
        this._discardedCard = card;
        if (!silent &&
            !this.dispatchEvent(new events_1.CardPlayEvent(card, this._currentPlayer)))
            return;
        if (currentPlayer.hand.length == 0) {
            var score = this.calculateScore();
            // game is over, we have a winner!
            this.dispatchEvent(new events_1.GameEndEvent(this._currentPlayer, score));
            // TODO: how to stop game after it's finished? Finished variable? >.<
            return;
        }
        switch (this._discardedCard.value) {
            case card_1.Values.WILD_DRAW_FOUR:
                this.privateDraw(this.getNextPlayer(), 4);
                this.goToNextPlayer(true);
                break;
            case card_1.Values.DRAW_TWO:
                this.privateDraw(this.getNextPlayer(), 2);
                this.goToNextPlayer(true);
                break;
            case card_1.Values.SKIP:
                this.goToNextPlayer(true);
                break;
            case card_1.Values.REVERSE:
                this.reverseGame();
                if (this._players.length == 2)
                    // Reverse works like Skip
                    this.goToNextPlayer(true);
                break;
        }
        this.goToNextPlayer();
    };
    Game.prototype.uno = function (yellingPlayer) {
        var _this = this;
        yellingPlayer = yellingPlayer || this._currentPlayer;
        // the users that will draw;
        var drawingPlayers;
        // if player is the one who has 1 card, just mark as yelled
        // (he may yell UNO! before throwing his card, so he may have
        // 2 cards at hand when yelling uno)
        if (yellingPlayer.hand.length <= 2 && !this.yellers[yellingPlayer.name]) {
            this.yellers[yellingPlayer.name] = true;
            return [];
        }
        else {
            // else if the user has already yelled or if he has more than 2 cards...
            // is there anyone with 1 card at hand that did not yell uno?
            drawingPlayers = this._players.filter(function (p) { return p.hand.length == 1 && !_this.yellers[p.name]; });
            // if there isn't anyone...
            if (drawingPlayers.length == 0) {
                // the player was lying, so he will draw
                drawingPlayers = [yellingPlayer];
            }
        }
        drawingPlayers.forEach(function (p) { return _this.privateDraw(p, 2); });
        // return who drawn
        return drawingPlayers;
    };
    Game.prototype.fixPlayers = function (playerNames) {
        if (!playerNames ||
            !playerNames.length ||
            playerNames.length < 2 ||
            playerNames.length > 10)
            throw new Error('There must be 2 to 10 players in the game');
        else if (findDuplicates(playerNames).length)
            throw new Error('Player names must be different');
        return playerNames.map(function (player) {
            return new player_1.Player(player);
        });
    };
    Game.prototype.getNextPlayer = function () {
        var idx = this.getPlayerIndex(this._currentPlayer);
        if (++idx == this._players.length)
            idx = 0;
        return this._players[idx];
    };
    Game.prototype.getPlayerIndex = function (playerName) {
        if (typeof playerName !== 'string')
            playerName = playerName.name;
        return this._players.map(function (p) { return p.name; }).indexOf(playerName);
    };
    /**
     * Set current player to the next in the line,
     * with no validations, reseting all per-turn controllers
     * (`draw`, ...)
     *
     * @fires Game#nextplayer
     */
    Game.prototype.goToNextPlayer = function (silent) {
        this.drawn = false;
        this._currentPlayer = this.getNextPlayer();
        if (!silent)
            this.dispatchEvent(new events_1.NextPlayerEvent(this._currentPlayer));
    };
    Game.prototype.reverseGame = function () {
        this._players.reverse();
        this.direction =
            this.direction == game_directions_1.GameDirections.CLOCKWISE
                ? game_directions_1.GameDirections.COUNTER_CLOCKWISE
                : game_directions_1.GameDirections.CLOCKWISE;
    };
    /**
     * Add the given amount of cards to the given player's hand
     * from the draw pile.
     *
     * @param player the player to deliver the cards
     * @param amount the amount that must be drawn
     * @returns the drawn cards
     */
    Game.prototype.privateDraw = function (player, amount) {
        if (!player)
            throw new Error('Player is mandatory');
        // console.log(`draw ${amount} to ${player}`);
        var cards = this.drawPile.draw(amount);
        player.hand = player.hand.concat(cards);
        return cards;
    };
    Game.prototype.calculateScore = function () {
        return this._players.map(function (player) { return player.hand; }).reduce(function (amount, cards) {
            amount += cards.reduce(function (s, c) { return (s += c.score); }, 0);
            return amount;
        }, 0);
    };
    return Game;
}(events_1.CancelableEventEmitter));
exports.Game = Game;
/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// https://stackoverflow.com/a/24968449/1574059
function findDuplicates(array) {
    // expects an string array
    var uniq = array
        .map(function (name, idx) {
        return { count: 1, name: name };
    })
        .reduce(function (a, b) {
        a[b.name] = (a[b.name] || 0) + b.count;
        return a;
    }, {});
    var duplicates = Object.keys(uniq).filter(function (a) { return uniq[a] > 1; });
    return duplicates;
}
function isObject(val) {
    return val !== null && typeof val === 'object';
}
//# sourceMappingURL=game.js.map