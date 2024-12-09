import type { MaybeGetter } from "../../internal/types.js";
/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export declare class IsFocusWithin {
    #private;
    constructor(node: MaybeGetter<HTMLElement | undefined>);
    readonly current: boolean;
}
