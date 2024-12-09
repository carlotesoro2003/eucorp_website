import { type ReadableBoxedValues } from "svelte-toolbelt";
import type { WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type PopoverRootStateProps = WritableBoxedValues<{
    open: boolean;
}>;
declare class PopoverRootState {
    open: PopoverRootStateProps["open"];
    contentNode: HTMLElement | null;
    contentId: string | undefined;
    triggerNode: HTMLElement | null;
    constructor(props: PopoverRootStateProps);
    toggleOpen: () => void;
    close: () => void;
}
type PopoverTriggerStateProps = WithRefProps & ReadableBoxedValues<{
    disabled: boolean;
}>;
declare class PopoverTriggerState {
    #private;
    constructor(props: PopoverTriggerStateProps, root: PopoverRootState);
    props: {
        readonly id: string;
        readonly "aria-haspopup": "dialog";
        readonly "aria-expanded": "true" | "false";
        readonly "data-state": "open" | "closed";
        readonly "aria-controls": string | undefined;
        readonly "data-popover-trigger": "";
        readonly disabled: boolean;
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
    };
}
type PopoverContentStateProps = WithRefProps;
declare class PopoverContentState {
    #private;
    root: PopoverRootState;
    constructor(props: PopoverContentStateProps, root: PopoverRootState);
    snippetProps: {
        open: boolean;
    };
    props: {
        id: string;
        tabindex: number;
        "data-state": "open" | "closed";
        "data-popover-content": string;
        style: {
            pointerEvents: string;
        };
    };
}
type PopoverCloseStateProps = WithRefProps;
declare class PopoverCloseState {
    #private;
    constructor(props: PopoverCloseStateProps, root: PopoverRootState);
    props: {
        readonly id: string;
        readonly onclick: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly type: "button";
        readonly "data-popover-close": "";
    };
}
export declare function usePopoverRoot(props: PopoverRootStateProps): PopoverRootState;
export declare function usePopoverTrigger(props: PopoverTriggerStateProps): PopoverTriggerState;
export declare function usePopoverContent(props: PopoverContentStateProps): PopoverContentState;
export declare function usePopoverClose(props: PopoverCloseStateProps): PopoverCloseState;
export {};
