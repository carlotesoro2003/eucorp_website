import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type ToggleRootStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
}> & WritableBoxedValues<{
    pressed: boolean;
}>>;
declare class ToggleRootState {
    #private;
    pressed: ToggleRootStateProps["pressed"];
    constructor(props: ToggleRootStateProps);
    props: {
        readonly "data-toggle-root": "";
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "aria-pressed": "true" | "false";
        readonly "data-state": "off" | "on";
        readonly disabled: true | undefined;
        readonly onclick: () => void;
    };
}
export declare function useToggleRoot(props: ToggleRootStateProps): ToggleRootState;
export declare function getToggleDataState(condition: boolean): "on" | "off";
export {};
