import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
type CollapsibleRootStateProps = WritableBoxedValues<{
    open: boolean;
    ref: HTMLElement | null;
}> & ReadableBoxedValues<{
    disabled: boolean;
    id: string;
}>;
declare class CollapsibleRootState {
    #private;
    open: CollapsibleRootStateProps["open"];
    disabled: CollapsibleRootStateProps["disabled"];
    contentNode: HTMLElement | null;
    contentId: string | undefined;
    constructor(props: CollapsibleRootStateProps);
    toggleOpen(): void;
    props: {
        readonly id: string;
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-collapsible-root": "";
    };
}
type CollapsibleContentStateProps = ReadableBoxedValues<{
    id: string;
    forceMount: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class CollapsibleContentState {
    #private;
    root: CollapsibleRootState;
    present: boolean;
    constructor(props: CollapsibleContentStateProps, root: CollapsibleRootState);
    snippetProps: {
        open: boolean;
    };
    props: {
        readonly id: string;
        readonly style: {
            readonly "--bits-collapsible-content-height": string | undefined;
            readonly "--bits-collapsible-content-width": string | undefined;
        };
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-collapsible-content": "";
    };
}
type CollapsibleTriggerStateProps = ReadableBoxedValues<{
    id: string;
    disabled: boolean | null | undefined;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class CollapsibleTriggerState {
    #private;
    constructor(props: CollapsibleTriggerStateProps, root: CollapsibleRootState);
    props: {
        readonly id: string;
        readonly type: "button";
        readonly disabled: boolean;
        readonly "aria-controls": string | undefined;
        readonly "aria-expanded": "true" | "false";
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-collapsible-trigger": "";
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
export declare function useCollapsibleRoot(props: CollapsibleRootStateProps): CollapsibleRootState;
export declare function useCollapsibleTrigger(props: CollapsibleTriggerStateProps): CollapsibleTriggerState;
export declare function useCollapsibleContent(props: CollapsibleContentStateProps): CollapsibleContentState;
export {};
