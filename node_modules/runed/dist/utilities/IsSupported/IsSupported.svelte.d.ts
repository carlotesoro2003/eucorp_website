/**
 * A class that takes a predicate to determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @see {@link https://runed.dev/docs/utilities/supported}
 */
export declare class IsSupported {
    #private;
    constructor(predicate: () => boolean);
    get current(): boolean;
}
