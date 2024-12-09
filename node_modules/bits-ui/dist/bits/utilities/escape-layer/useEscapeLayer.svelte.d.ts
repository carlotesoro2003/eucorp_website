import type { EscapeLayerImplProps } from "./types.js";
import type { ReadableBoxedValues } from "../../../internal/box.svelte.js";
type EscapeLayerStateProps = ReadableBoxedValues<Required<Omit<EscapeLayerImplProps, "children">>>;
export declare class EscapeLayerState {
    #private;
    constructor(props: EscapeLayerStateProps);
}
export declare function useEscapeLayer(props: EscapeLayerStateProps): EscapeLayerState;
export {};
