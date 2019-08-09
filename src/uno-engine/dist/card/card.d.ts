import { Colors } from './colors';
import { Values } from './values';
export declare class Card {
    private _value;
    private _color;
    constructor(value: Values, color?: Colors);
    color: Colors;
    readonly value: Values;
    isWildCard(): boolean;
    isSpecialCard(): boolean;
    matches(other: Card): boolean;
    readonly score: Values.ZERO | Values.ONE | Values.TWO | Values.THREE | Values.FOUR | Values.FIVE | Values.SIX | Values.SEVEN | Values.EIGHT | Values.NINE | 20 | 50;
    is(value: Values, color?: Colors): boolean;
    toString(): string;
}
