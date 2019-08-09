import { Card, Values } from './card';
export declare class Player {
    name: string;
    hand: Card[];
    constructor(name: string);
    getCardByValue(value: Values): Card;
    hasCard(card: Card): boolean;
    removeCard(card: Card): void;
    valueOf(): string;
    toString(): string;
}
