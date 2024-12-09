import { Previous } from "runed";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { Direction, Orientation } from "../../shared/index.js";
import type { ElementRef, WithRefProps } from "../../internal/types.js";
import { noop } from "../../internal/noop.js";
import { useRovingFocus } from "../../internal/use-roving-focus.svelte.js";
type NavigationMenuRootStateProps = ReadableBoxedValues<{
    id: string;
    delayDuration: number;
    skipDelayDuration: number;
    orientation: Orientation;
    dir: Direction;
}> & WritableBoxedValues<{
    value: string;
    ref: HTMLElement | null;
}>;
declare class NavigationMenuRootState {
    id: NavigationMenuRootStateProps["id"];
    rootRef: NavigationMenuRootStateProps["ref"];
    delayDuration: NavigationMenuRootStateProps["delayDuration"];
    skipDelayDuration: NavigationMenuRootStateProps["skipDelayDuration"];
    orientation: NavigationMenuRootStateProps["orientation"];
    dir: NavigationMenuRootStateProps["dir"];
    value: NavigationMenuRootStateProps["value"];
    previousValue: Previous<string>;
    openTimer: number;
    closeTimer: number;
    skipDelayTimer: number;
    isOpenDelayed: boolean;
    setValue: (v: string) => void;
    constructor(props: NavigationMenuRootStateProps);
    startCloseTimer: () => void;
    handleOpen: (itemValue: string) => void;
    handleClose: () => void;
    handleDelayedOpen: (itemValue: string) => void;
    onTriggerEnter: (itemValue: string) => void;
    onTriggerLeave: () => void;
    onContentEnter: () => void;
    onContentLeave: () => void;
    onItemSelect: (itemValue: string) => void;
    onItemDismiss: () => void;
    props: {
        id: string;
        "aria-label": string;
        "data-orientation": "horizontal" | "vertical";
        dir: Direction;
        "data-navigation-menu-root": string;
    };
}
type NavigationMenuMenuStateProps = ReadableBoxedValues<{
    rootNavigationId: string;
    dir: Direction;
    orientation: Orientation;
}> & WritableBoxedValues<{
    value: string;
}> & {
    isRoot: boolean;
    onTriggerEnter: (itemValue: string) => void;
    onTriggerLeave?: () => void;
    onContentEnter?: () => void;
    onContentLeave?: () => void;
    onItemSelect: (itemValue: string) => void;
    onItemDismiss: () => void;
    previousValue: Previous<string>;
};
declare class NavigationMenuMenuState {
    isRoot: NavigationMenuMenuStateProps["isRoot"];
    rootNavigationId: NavigationMenuMenuStateProps["rootNavigationId"];
    dir: NavigationMenuMenuStateProps["dir"];
    orientation: NavigationMenuMenuStateProps["orientation"];
    value: NavigationMenuMenuStateProps["value"];
    previousValue: NavigationMenuMenuStateProps["previousValue"];
    onTriggerEnter: NavigationMenuMenuStateProps["onTriggerEnter"];
    onTriggerLeave: NavigationMenuMenuStateProps["onTriggerLeave"];
    onContentEnter: NavigationMenuMenuStateProps["onContentEnter"];
    onContentLeave: NavigationMenuMenuStateProps["onContentLeave"];
    onItemSelect: NavigationMenuMenuStateProps["onItemSelect"];
    onItemDismiss: NavigationMenuMenuStateProps["onItemDismiss"];
    viewportNode: HTMLElement | null;
    indicatorTrackNode: HTMLElement | null;
    viewportContentId: import("svelte-toolbelt").ReadableBox<string | undefined>;
    root: NavigationMenuRootState;
    triggerRefs: Set<ElementRef>;
    constructor(props: NavigationMenuMenuStateProps, root: NavigationMenuRootState);
    registerTrigger: (ref: ElementRef) => void;
    deRegisterTrigger: (ref: ElementRef) => void;
    getTriggerNodes: () => HTMLElement[];
}
type NavigationMenuSubStateProps = ReadableBoxedValues<{
    id: string;
    orientation: Orientation;
}> & WritableBoxedValues<{
    value: string;
    ref: HTMLElement | null;
}>;
declare class NavigationMenuSubState {
    id: NavigationMenuSubStateProps["id"];
    isRoot: boolean;
    rootNavigationId: NavigationMenuMenuStateProps["rootNavigationId"];
    dir: NavigationMenuMenuStateProps["dir"];
    orientation: NavigationMenuMenuStateProps["orientation"];
    value: NavigationMenuMenuStateProps["value"];
    previousValue: Previous<string>;
    onTriggerLeave: NavigationMenuMenuStateProps["onTriggerLeave"];
    onContentEnter: NavigationMenuMenuStateProps["onContentEnter"];
    onContentLeave: NavigationMenuMenuStateProps["onContentLeave"];
    viewportNode: HTMLElement | null;
    indicatorTrackNode: HTMLElement | null;
    viewportContentId: import("svelte-toolbelt").ReadableBox<string | undefined>;
    root: NavigationMenuRootState;
    triggerRefs: Set<ElementRef>;
    ref: NavigationMenuSubStateProps["ref"];
    constructor(props: NavigationMenuSubStateProps, root: NavigationMenuRootState);
    onTriggerEnter: (itemValue: string) => void;
    onItemSelect: (itemValue: string) => void;
    onItemDismiss: () => void;
    registerTrigger: (ref: ElementRef) => void;
    deRegisterTrigger: (ref: ElementRef) => void;
    getTriggerNodes: () => HTMLElement[];
    createList(props: NavigationMenuListStateProps): NavigationMenuListState;
    createIndicator(props: NavigationMenuIndicatorStateProps): NavigationMenuIndicatorState;
    createViewport(props: NavigationMenuViewportStateProps): NavigationMenuViewportState;
    props: {
        id: string;
        "data-orientation": "horizontal" | "vertical";
        "data-navigation-menu-sub": string;
    };
}
type NavigationMenuListStateProps = ReadableBoxedValues<{
    id: string;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
    indicatorTrackRef: HTMLElement | null;
}>;
declare class NavigationMenuListState {
    #private;
    readonly menu: NavigationMenuMenuState | NavigationMenuSubState;
    indicatorTrackRef: NavigationMenuListStateProps["indicatorTrackRef"];
    indicatorTrackId: import("svelte-toolbelt").WritableBox<string>;
    rovingFocusGroup: ReturnType<typeof useRovingFocus>;
    constructor(props: NavigationMenuListStateProps, menu: NavigationMenuMenuState | NavigationMenuSubState);
    indicatorTrackProps: {
        readonly id: string;
        readonly style: {
            readonly position: "relative";
        };
    };
    createItem(props: NavigationMenuItemStateProps): NavigationMenuItemState;
    props: {
        readonly id: string;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-navigation-menu-list": "";
    };
}
type NavigationMenuItemStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
}>>;
declare class NavigationMenuItemState {
    #private;
    id: NavigationMenuItemStateProps["id"];
    value: NavigationMenuItemStateProps["value"];
    contentNode: HTMLElement | null;
    triggerNode: HTMLElement | null;
    focusProxyRef: import("svelte-toolbelt").WritableBox<HTMLElement | null>;
    focusProxyNode: HTMLElement | null;
    focusProxyId: import("svelte-toolbelt").WritableBox<string>;
    restoreContentTabOrder: typeof noop;
    wasEscapeClose: boolean;
    menu: NavigationMenuMenuState | NavigationMenuSubState;
    list: NavigationMenuListState;
    constructor(props: NavigationMenuItemStateProps, list: NavigationMenuListState, menu: NavigationMenuMenuState | NavigationMenuSubState);
    onEntryKeydown: (side?: "start" | "end") => void;
    onFocusProxyEnter: (side?: "start" | "end") => void;
    onContentFocusOutside: () => void;
    onRootContentClose: () => void;
    props: {
        readonly id: string;
        readonly "data-navigation-menu-item": "";
    };
}
type NavigationMenuTriggerStateProps = ReadableBoxedValues<{
    id: string;
    disabled: boolean;
    focusProxyMounted: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class NavigationMenuTriggerState {
    #private;
    focusProxyMounted: NavigationMenuTriggerStateProps["focusProxyMounted"];
    menu: NavigationMenuMenuState | NavigationMenuSubState;
    item: NavigationMenuItemState;
    disabled: NavigationMenuTriggerStateProps["disabled"];
    hasPointerMoveOpened: import("svelte-toolbelt").WritableBox<boolean>;
    wasClickClose: boolean;
    open: boolean;
    constructor(props: NavigationMenuTriggerStateProps, item: NavigationMenuItemState);
    props: {
        readonly id: string;
        readonly disabled: true | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "open" | "closed";
        readonly "aria-expanded": "true" | "false";
        readonly "aria-controls": string | undefined;
        readonly "data-value": string;
        readonly onpointerenter: () => void;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => void;
        readonly onclick: (_: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly "data-navigation-menu-trigger": "";
    };
    visuallyHiddenProps: {
        readonly id: string;
        readonly "aria-hidden": "true";
        readonly tabIndex: 0;
        readonly onfocus: (e: FocusEvent) => void;
    };
}
type NavigationMenuLinkStateProps = WithRefProps & ReadableBoxedValues<{
    active: boolean;
    onSelect: (e: Event) => void;
}>;
declare class NavigationMenuLinkState {
    #private;
    active: NavigationMenuLinkStateProps["active"];
    onSelect: NavigationMenuLinkStateProps["onSelect"];
    content?: NavigationMenuContentState;
    item: NavigationMenuItemState;
    constructor(props: NavigationMenuLinkStateProps, item: NavigationMenuItemState, content?: NavigationMenuContentState);
    props: {
        readonly id: string;
        readonly "data-active": "" | undefined;
        readonly "aria-current": "page" | undefined;
        readonly "data-list-link": "" | undefined;
        readonly onclick: (e: MouseEvent) => void;
        readonly onfocus: (_: FocusEvent) => void;
        readonly onkeydown: ((e: KeyboardEvent) => void) | undefined;
    };
}
type NavigationMenuIndicatorStateProps = ReadableBoxedValues<{
    id: string;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class NavigationMenuIndicatorState {
    id: NavigationMenuIndicatorStateProps["id"];
    menu: NavigationMenuMenuState | NavigationMenuSubState;
    activeTrigger: HTMLElement | null;
    position: {
        size: number;
        offset: number;
    } | null;
    isHorizontal: boolean;
    isVisible: boolean;
    indicatorRef: NavigationMenuIndicatorStateProps["ref"];
    constructor(props: NavigationMenuIndicatorStateProps, menu: NavigationMenuMenuState | NavigationMenuSubState);
    handlePositionChange: () => void;
    props: {
        readonly "aria-hidden": "true" | undefined;
        readonly "data-state": "hidden" | "visible";
        readonly "data-orientation": "horizontal" | "vertical";
        readonly style: {
            readonly left: number;
            readonly width: string | undefined;
            readonly transform: string | undefined;
            readonly position: "absolute";
        } | {
            readonly top: number;
            readonly height: string | undefined;
            readonly transform: string | undefined;
            readonly position: "absolute";
        };
        readonly "data-navigation-menu-indicator": "";
    };
}
type NavigationMenuContentStateProps = ReadableBoxedValues<{
    id: string;
    forceMount: boolean;
    isMounted: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
type MotionAttribute = "to-start" | "to-end" | "from-start" | "from-end";
declare class NavigationMenuContentState {
    #private;
    id: NavigationMenuContentStateProps["id"];
    forceMount: NavigationMenuContentStateProps["forceMount"];
    isMounted: NavigationMenuContentStateProps["isMounted"];
    contentRef: NavigationMenuContentStateProps["ref"];
    menu: NavigationMenuMenuState | NavigationMenuSubState;
    item: NavigationMenuItemState;
    prevMotionAttribute: MotionAttribute | null;
    motionAttribute: MotionAttribute | null;
    open: boolean;
    isPresent: boolean;
    constructor(props: NavigationMenuContentStateProps, item: NavigationMenuItemState);
    onFocusOutside: (e: Event) => void;
    onInteractOutside: (e: Event) => void;
    onEscapeKeydown: (e: KeyboardEvent) => void;
    props: {
        readonly id: string;
        readonly "aria-labelledby": string | undefined;
        readonly "data-motion": MotionAttribute | null;
        readonly "data-state": "open" | "closed";
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-navigation-menu-content": "";
        readonly style: {
            readonly pointerEvents: "none" | undefined;
        };
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type NavigationMenuViewportStateProps = ReadableBoxedValues<{
    id: string;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class NavigationMenuViewportState {
    #private;
    id: NavigationMenuViewportStateProps["id"];
    menu: NavigationMenuMenuState | NavigationMenuSubState;
    size: {
        width: number;
        height: number;
    } | null;
    open: boolean;
    activeContentValue: string;
    viewportRef: NavigationMenuViewportStateProps["ref"];
    contentNode: HTMLElement | null | undefined;
    constructor(props: NavigationMenuViewportStateProps, menu: NavigationMenuMenuState | NavigationMenuSubState);
    props: {
        readonly id: string;
        readonly "data-state": "open" | "closed";
        readonly "data-orientation": "horizontal" | "vertical";
        readonly style: {
            readonly pointerEvents: "none" | undefined;
            readonly "--bits-navigation-menu-viewport-width": string | undefined;
            readonly "--bits-navigation-menu-viewport-height": string | undefined;
        };
        readonly onpointerenter: () => void;
        readonly onpointerleave: (e: PointerEvent) => void;
    };
}
export declare function useNavigationMenuRoot(props: NavigationMenuRootStateProps): NavigationMenuRootState;
export declare function useNavigationMenuList(props: NavigationMenuListStateProps): NavigationMenuListState;
export declare function useNavigationMenuItem(props: NavigationMenuItemStateProps): NavigationMenuItemState;
export declare function useNavigationMenuTrigger(props: NavigationMenuTriggerStateProps): NavigationMenuTriggerState;
export declare function useNavigationMenuContent(props: NavigationMenuContentStateProps): NavigationMenuContentState;
export declare function useNavigationMenuViewport(props: NavigationMenuViewportStateProps): NavigationMenuViewportState;
export declare function useNavigationMenuIndicator(props: NavigationMenuIndicatorStateProps): NavigationMenuIndicatorState;
export declare function useNavigationMenuLink(props: NavigationMenuLinkStateProps): NavigationMenuLinkState;
export {};
