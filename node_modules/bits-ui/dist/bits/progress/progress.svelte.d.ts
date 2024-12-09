import type { ReadableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type ProgressRootStateProps = WithRefProps<ReadableBoxedValues<{
    value: number | null;
    max: number;
}>>;
declare class ProgressRootState {
    #private;
    constructor(props: ProgressRootStateProps);
    props: {
        readonly role: "meter";
        readonly value: number | null;
        readonly max: number;
        readonly "aria-valuemin": 0;
        readonly "aria-valuemax": number;
        readonly "aria-valuenow": number | null;
        readonly "data-value": number | null;
        readonly "data-state": "indeterminate" | "loading" | "loaded";
        readonly "data-max": number;
        readonly "data-progress-root": "";
    };
}
export declare function useProgressRootState(props: ProgressRootStateProps): ProgressRootState;
export {};
