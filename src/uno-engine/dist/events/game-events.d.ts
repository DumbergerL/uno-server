import { Card } from '../card';
import { Player } from '../player';
import { Event } from './event';
/**
 * Fired when a player requests cards from the draw pile.
 */
export declare class BeforeDrawEvent extends Event {
    readonly player: Player;
    readonly quantity: number;
    /**
     * @param {Player} player  thatThe player will draw
     * @param {number} quantity The quantity of cards will be drawn
     */
    constructor(player: Player, quantity: number);
}
/**
 * Fired after player's drawn cards are added to his hands.
 */
export declare class DrawEvent extends Event {
    readonly player: Player;
    readonly cards: Card[];
    /**
     * @param {Player} player The player that has drawn
     * @param {Card[]} cards The cards that were drawn
     */
    constructor(player: Player, cards: Card[]);
}
/**
 * Fired when a player can pass and requests to pass its turn.
 */
export declare class BeforePassEvent extends Event {
    readonly player: Player;
    /**
     * @param {Player} player The player that will pass
     */
    constructor(player: Player);
}
/**
 * Fired before player discards a card in the discard pile.
 */
export declare class BeforeCardPlayEvent extends Event {
    readonly card: Card;
    readonly player: Player;
    /**
     * @param {Card} card The card that will be played
     * @param {Player} player The player that will play
     */
    constructor(card: Card, player: Player);
}
/**
 * Fired after player's card is thrown in the discard pile.
 */
export declare class CardPlayEvent extends Event {
    readonly card: Card;
    readonly player: Player;
    /**
     * @param {Card} card The card that was played
     * @param {Player} player The player that played
     */
    constructor(card: Card, player: Player);
}
/**
 * Fired when {@link game#currentPlayer | currentPlayer} changes.
 */
export declare class NextPlayerEvent extends Event {
    readonly player: Player;
    /**
     * @param {Player} player The new player
     */
    constructor(player: Player);
}
/**
 * Fired when `winner` has 0 cards at hand.
 */
export declare class GameEndEvent extends Event {
    readonly winner: Player;
    readonly score: number;
    /**
     * @param {Player} winner The big winner
     * @param {number} score Player's final score
     */
    constructor(winner: Player, score: number);
}
