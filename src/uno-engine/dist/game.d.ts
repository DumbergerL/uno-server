import { Card } from './card';
import { Deck } from './deck';
import { CancelableEventEmitter } from './events';
import { GameDirections } from './game-directions';
import { Player } from './player';
export declare class Game extends CancelableEventEmitter {
    /**
     * @event Game#beforedraw
     * @type {BeforeDrawEvent}
     */
    /**
     * @event Game#draw
     * @type {DrawEvent}
     */
    /**
     * @event Game#beforepass
     * @type {BeforePassEvent}
     */
    /**
     * @event Game#beforecardplay
     * @type {BeforeCardPlayEvent}
     */
    /**
     * @event Game#cardplay
     * @type {CardPlayEvent}
     */
    /**
     * @event Game#nextplayer
     * @type {NextPlayerEvent}
     */
    /**
     * @event Game#end
     * @type {GameEndEvent}
     */
    private drawPile;
    private direction;
    private _currentPlayer;
    private _players;
    private _discardedCard;
    /**
     * The player have draw in his turn?
     */
    private drawn;
    /**
     * Who yelled uno?
     *
     * key: player name
     * value: true/false
     */
    private yellers;
    constructor(playerNames: string[], houseRules?: {
        setup: Function;
    }[]);
    newGame(): void;
    getPlayer(name: string): Player;
    currentPlayer: Player;
    readonly nextPlayer: Player;
    discardedCard: Card;
    readonly players: Player[];
    readonly deck: Deck;
    playingDirection: GameDirections;
    /**
     * @fires Game#beforedraw
     * @fires Game#draw
     */
    draw(player?: Player, qty?: number, { silent }?: {
        silent: boolean;
    }): void;
    /**
     * @fires Game#beforepass
     * @fires Game#nextplayer
     */
    pass(): void;
    /**
     * @fires Game#beforecardplay
     * @fires Game#cardplay
     * @fires Game#nextplayer
     * @fires Game#end
     */
    play(card: Card, { silent }?: {
        silent: boolean;
    }): void;
    uno(yellingPlayer?: Player): Player[];
    fixPlayers(playerNames: string[]): Player[];
    getNextPlayer(): Player;
    getPlayerIndex(playerName: string | Player): number;
    /**
     * Set current player to the next in the line,
     * with no validations, reseting all per-turn controllers
     * (`draw`, ...)
     *
     * @fires Game#nextplayer
     */
    goToNextPlayer(silent?: boolean): void;
    reverseGame(): void;
    /**
     * Add the given amount of cards to the given player's hand
     * from the draw pile.
     *
     * @param player the player to deliver the cards
     * @param amount the amount that must be drawn
     * @returns the drawn cards
     */
    private privateDraw;
    calculateScore(): number;
}
