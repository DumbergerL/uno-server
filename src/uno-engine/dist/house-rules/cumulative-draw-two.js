"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var card_1 = require("../card");
function CumulativeDrawTwo(game) {
    var state = 'normal';
    setup(game);
    /**
     * How many cards must be drawn in the next draw() call.
     * It's used when there's a row of DRAW_TWO running.
     */
    var cardsToDraw = 0;
    function setup(game) {
        game.on('beforepass', beforePass.bind(this, game));
        game.on('beforedraw', beforeDraw.bind(this, game));
        game.on('beforecardplay', beforePlay.bind(this, game));
        game.on('cardplay', onCardPlay.bind(this, game));
    }
    /**
     * @param {Game} game
     * @param {CardPlayEvent} event
     */
    function onCardPlay(game, event) {
        var card = event.card;
        if (card.is(card_1.Values.DRAW_TWO)) {
            cardsToDraw += 2;
            state = 'stacking';
            game.play(card, { silent: true });
            // we'll take over from here
            return false;
        }
        return true;
    }
    /**
     * @param {Game} game
     * @param {BeforePassEvent} event
     */
    function beforePass(game, event) {
        if (isStacking())
            throw new Error("There are " + cardsToDraw + " cards to draw before passing");
    }
    /**
     * @param {Game} game
     * @param {BeforeCardPlayEvent} event
     */
    function beforePlay(game, event) {
        var card = event.card, player = event.player;
        if (isStacking() && !card.is(card_1.Values.DRAW_TWO))
            throw new Error(player + " must draw cards");
    }
    /**
     * @param {Game} game
     * @param {BeforeDrawEvent} event
     */
    function beforeDraw(game, event) {
        if (!isStacking())
            return true;
        var player = event.player;
        game.draw(player, cardsToDraw, { silent: true });
        cardsToDraw = 0;
        game.pass();
        return false;
    }
    /**
     * Whether or not we are in a row of draw twos.
     */
    function isStacking() {
        return cardsToDraw > 0;
    }
}
exports.default = {
    setup: function (game) {
        return CumulativeDrawTwo(game);
    },
};
//# sourceMappingURL=cumulative-draw-two.js.map