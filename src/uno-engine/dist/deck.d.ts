import { Card } from './card';
export declare class Deck {
    private originalDraw;
    private shuffle;
    readonly cards: Card[];
    readonly length: number;
    constructor();
    draw(num?: number): Card[];
}
