import type { MaybeGetter } from "../../internal/types.js";
type Rect = Omit<DOMRect, "toJSON">;
export type ElementRectOptions = {
    initialRect?: DOMRect;
};
/**
 * Returns a reactive value holding the size of `node`.
 *
 * Accepts an `options` object with the following properties:
 * - `initialSize`: The initial size of the element. Defaults to `{ width: 0, height: 0 }`.
 * - `box`: The box model to use. Can be either `"content-box"` or `"border-box"`. Defaults to `"border-box"`.
 *
 * @returns an object with `width` and `height` properties.
 *
 * @see {@link https://runed.dev/docs/utilities/element-size}
 */
export declare class ElementRect {
    #private;
    constructor(node: MaybeGetter<HTMLElement | undefined>, options?: ElementRectOptions);
    get x(): number;
    get y(): number;
    get width(): number;
    get height(): number;
    get top(): number;
    get right(): number;
    get bottom(): number;
    get left(): number;
    get current(): Rect;
}
export {};
