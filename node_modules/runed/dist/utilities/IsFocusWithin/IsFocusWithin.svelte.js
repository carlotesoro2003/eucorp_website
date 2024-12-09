import { extract } from "../extract/extract.svelte.js";
import { activeElement } from "../activeElement/activeElement.svelte.js";
/**
 * Tracks whether the focus is within a target element.
 * @see {@link https://runed.dev/docs/utilities/is-focus-within}
 */
export class IsFocusWithin {
    #node;
    #target = $derived.by(() => extract(this.#node));
    constructor(node) {
        this.#node = node;
    }
    current = $derived.by(() => {
        if (!this.#target || !activeElement.current)
            return false;
        return this.#target.contains(activeElement.current);
    });
}
