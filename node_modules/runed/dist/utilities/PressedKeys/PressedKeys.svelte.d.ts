/**
 * Tracks which keys are currently pressed.
 *
 * @see {@link https://runed.dev/docs/utilities/pressed-keys}
 */
export declare class PressedKeys {
    #private;
    constructor();
    has(...keys: string[]): boolean;
    get all(): string[];
}
