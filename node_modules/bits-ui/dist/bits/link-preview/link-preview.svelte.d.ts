import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type LinkPreviewRootStateProps = WritableBoxedValues<{
    open: boolean;
}> & ReadableBoxedValues<{
    openDelay: number;
    closeDelay: number;
}>;
declare class LinkPreviewRootState {
    open: LinkPreviewRootStateProps["open"];
    openDelay: LinkPreviewRootStateProps["openDelay"];
    closeDelay: LinkPreviewRootStateProps["closeDelay"];
    hasSelection: boolean;
    isPointerDownOnContent: boolean;
    containsSelection: boolean;
    timeout: number | null;
    contentNode: HTMLElement | null;
    contentId: string | undefined;
    contentMounted: boolean;
    triggerNode: HTMLElement | null;
    isPointerInTransit: import("svelte-toolbelt").WritableBox<boolean>;
    isOpening: boolean;
    constructor(props: LinkPreviewRootStateProps);
    clearTimeout: () => void;
    handleOpen: () => void;
    immediateClose: () => void;
    handleClose: () => void;
}
type LinkPreviewTriggerStateProps = WithRefProps;
declare class LinkPreviewTriggerState {
    #private;
    constructor(props: LinkPreviewTriggerStateProps, root: LinkPreviewRootState);
    props: {
        readonly id: string;
        readonly "aria-haspopup": "dialog";
        readonly "aria-expanded": "true" | "false";
        readonly "data-state": "open" | "closed";
        readonly "aria-controls": string | undefined;
        readonly role: "button";
        readonly "data-link-preview-trigger": "";
        readonly onpointerenter: (e: PointerEvent) => void;
        readonly onfocus: (e: FocusEvent & {
            currentTarget: HTMLElement;
        }) => void;
        readonly onblur: () => void;
        readonly onpointerleave: (e: PointerEvent) => void;
    };
}
type LinkPreviewContentStateProps = WithRefProps;
declare class LinkPreviewContentState {
    #private;
    root: LinkPreviewRootState;
    constructor(props: LinkPreviewContentStateProps, root: LinkPreviewRootState);
    snippetProps: {
        open: boolean;
    };
    props: {
        readonly id: string;
        readonly tabindex: -1;
        readonly "data-state": "open" | "closed";
        readonly "data-link-preview-content": "";
        readonly onpointerdown: (e: PointerEvent & {
            currentTarget: HTMLElement;
        }) => void;
        readonly onpointerenter: (e: PointerEvent) => void;
        readonly onfocusout: (e: FocusEvent) => void;
    };
}
export declare function useLinkPreviewRoot(props: LinkPreviewRootStateProps): LinkPreviewRootState;
export declare function useLinkPreviewTrigger(props: LinkPreviewTriggerStateProps): LinkPreviewTriggerState;
export declare function useLinkPreviewContent(props: LinkPreviewContentStateProps): LinkPreviewContentState;
export {};
