"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shuffle_1 = require("shuffle");
var card_1 = require("./card");
function createUnoDeck() {
    /*
      108 cards
  
      76x numbers (0-9, all colors)
      8x draw two (2x each color)
      8x reverse (2x each color)
      8x skip (2x each color)
      4x wild
      4x wild draw four
    */
    var deck = [];
    var createCards = function (qty, value, color) {
        var cards = [];
        for (var i = 0; i < qty; i++)
            cards.push(new card_1.Card(value, color));
        return cards;
    };
    // for each color...
    for (var color = 1; color <= 4; color++) {
        // CREATE NUMBERS
        deck.push.apply(deck, createCards(1, card_1.Values.ZERO, color));
        for (var n = card_1.Values.ONE; n <= card_1.Values.NINE; n++) {
            deck.push.apply(deck, createCards(2, n, color));
        }
        deck.push.apply(deck, createCards(2, card_1.Values.DRAW_TWO, color));
        deck.push.apply(deck, createCards(2, card_1.Values.SKIP, color));
        deck.push.apply(deck, createCards(2, card_1.Values.REVERSE, color));
    }
    deck.push.apply(deck, createCards(4, card_1.Values.WILD));
    deck.push.apply(deck, createCards(4, card_1.Values.WILD_DRAW_FOUR));
    return deck;
}
var Deck = /** @class */ (function () {
    function Deck() {
        this.shuffle = shuffle_1.shuffle({ deck: createUnoDeck() });
    }
    Object.defineProperty(Deck.prototype, "cards", {
        get: function () {
            return this.shuffle.cards;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Deck.prototype, "length", {
        get: function () {
            return this.shuffle.length;
        },
        enumerable: true,
        configurable: true
    });
    Deck.prototype.draw = function (num) {
        num = num || 1;
        var cards = [];
        // if the amount to draw is more than the cards we have...
        if (num >= this.length) {
            var length_1 = this.length;
            // draw all we have...
            cards = cards.concat(this.shuffle.draw.call(this, length_1));
            // regenerate the draw pile
            this.shuffle.reset();
            this.shuffle.shuffle();
            // then draw the rest we need
            num = num - length_1;
            if (num === 0)
                return cards;
        }
        return cards.concat(this.shuffle.draw(num));
    };
    return Deck;
}());
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map