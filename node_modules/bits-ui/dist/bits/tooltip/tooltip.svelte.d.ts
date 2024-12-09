import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type TooltipProviderStateProps = ReadableBoxedValues<{
    delayDuration: number;
    disableHoverableContent: boolean;
    disableCloseOnTriggerClick: boolean;
    disabled: boolean;
    ignoreNonKeyboardFocus: boolean;
    skipDelayDuration: number;
}>;
declare class TooltipProviderState {
    #private;
    delayDuration: TooltipProviderStateProps["delayDuration"];
    disableHoverableContent: TooltipProviderStateProps["disableHoverableContent"];
    disableCloseOnTriggerClick: TooltipProviderStateProps["disableCloseOnTriggerClick"];
    disabled: TooltipProviderStateProps["disabled"];
    ignoreNonKeyboardFocus: TooltipProviderStateProps["ignoreNonKeyboardFocus"];
    skipDelayDuration: TooltipProviderStateProps["skipDelayDuration"];
    isOpenDelayed: boolean;
    isPointerInTransit: import("svelte-toolbelt").WritableBox<boolean>;
    constructor(props: TooltipProviderStateProps);
    onOpen: () => void;
    onClose: () => void;
}
type TooltipRootStateProps = ReadableBoxedValues<{
    delayDuration: number | undefined;
    disableHoverableContent: boolean | undefined;
    disableCloseOnTriggerClick: boolean | undefined;
    disabled: boolean | undefined;
    ignoreNonKeyboardFocus: boolean | undefined;
}> & WritableBoxedValues<{
    open: boolean;
}>;
declare class TooltipRootState {
    #private;
    open: TooltipRootStateProps["open"];
    _delayDuration: TooltipRootStateProps["delayDuration"];
    _disableHoverableContent: TooltipRootStateProps["disableHoverableContent"];
    _disableCloseOnTriggerClick: TooltipRootStateProps["disableCloseOnTriggerClick"];
    _disabled: TooltipRootStateProps["disabled"];
    _ignoreNonKeyboardFocus: TooltipRootStateProps["ignoreNonKeyboardFocus"];
    provider: TooltipProviderState;
    delayDuration: number;
    disableHoverableContent: boolean;
    disableCloseOnTriggerClick: boolean;
    disabled: boolean;
    ignoreNonKeyboardFocus: boolean;
    contentNode: HTMLElement | null;
    triggerNode: HTMLElement | null;
    stateAttr: string;
    constructor(props: TooltipRootStateProps, provider: TooltipProviderState);
    handleOpen: () => void;
    handleClose: () => void;
    onTriggerEnter: () => void;
    onTriggerLeave: () => void;
}
type TooltipTriggerStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
}>>;
declare class TooltipTriggerState {
    #private;
    constructor(props: TooltipTriggerStateProps, root: TooltipRootState);
    handlePointerUp: () => void;
    props: {
        id: string;
        "aria-describedby": string | undefined;
        "data-state": string;
        "data-disabled": "" | undefined;
        "data-delay-duration": string;
        "data-tooltip-trigger": string;
        tabindex: number | undefined;
        disabled: boolean;
        onpointerup: () => void;
        onpointerdown: () => void;
        onpointermove: (e: PointerEvent) => void;
        onpointerleave: () => void;
        onfocus: (e: FocusEvent & {
            currentTarget: HTMLElement;
        }) => void;
        onblur: () => void;
        onclick: () => void;
    };
}
type TooltipContentStateProps = WithRefProps;
declare class TooltipContentState {
    #private;
    root: TooltipRootState;
    constructor(props: TooltipContentStateProps, root: TooltipRootState);
    snippetProps: {
        open: boolean;
    };
    props: {
        readonly id: string;
        readonly "data-state": string;
        readonly "data-disabled": "" | undefined;
        readonly style: {
            readonly pointerEvents: "auto";
            readonly outline: "none";
        };
        readonly "data-tooltip-content": "";
    };
}
export declare function useTooltipProvider(props: TooltipProviderStateProps): TooltipProviderState;
export declare function useTooltipRoot(props: TooltipRootStateProps): TooltipRootState;
export declare function useTooltipTrigger(props: TooltipTriggerStateProps): TooltipTriggerState;
export declare function useTooltipContent(props: TooltipContentStateProps): TooltipContentState;
export {};
