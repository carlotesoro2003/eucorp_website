/**
 * A class that takes a predicate to determine if a browser API is supported.
 *
 * Useful for checking if a browser API is supported before attempting to use it.
 *
 * @see {@link https://runed.dev/docs/utilities/supported}
 */
export class IsSupported {
    #current = $state(false);
    constructor(predicate) {
        $effect(() => {
            this.#current = predicate();
        });
    }
    get current() {
        return this.#current;
    }
}
