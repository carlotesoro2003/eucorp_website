import type { MaybeGetter } from "../../internal/types.js";
/**
 * Takes a media query as an input and listens for changes to it,
 * holding a reactive property with its current state.
 *
 * @see {@link https://runed.dev/docs/utilities/media-query}
 *
 * @example
 * ```ts
 * const screen = new MediaQuery("(min-width: 640px)");
 *
 * $effect(() => {
 * 	if (screen.matches) {
 * 		console.log("The screen is less than 640px");
 * 	}
 * });
 * ```
 *
 * @example
 * ```ts
 * let media = $state("(min-width: 640px)");
 * const screen = new MediaQuery(() => media);
 *
 * $effect(() => {
 * 	if (screen.matches) {
 * 		console.log(`Media query ${media} is ${screen.match}`);
 * 	}
 * });
 *
 * media = "(min-width: 320px)";
 * ```
 */
export declare class MediaQuery {
    #private;
    constructor(query: MaybeGetter<string>);
    get matches(): boolean | undefined;
}
