import type { TextSelectionLayerImplProps } from "./types.js";
import type { ReadableBoxedValues } from "../../../internal/box.svelte.js";
type StateProps = ReadableBoxedValues<Required<Omit<TextSelectionLayerImplProps, "children">>>;
export declare class TextSelectionLayerState {
    #private;
    constructor(props: StateProps);
}
export declare function useTextSelectionLayer(props: StateProps): TextSelectionLayerState;
export {};
