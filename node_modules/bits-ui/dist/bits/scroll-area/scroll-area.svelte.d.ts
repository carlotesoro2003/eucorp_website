/**
 * This logic is adapted from Radix UI ScrollArea component.
 * https://github.com/radix-ui/primitives/blob/main/packages/react/scroll-area/src/ScrollArea.tsx
 * Credit to Jenna Smith (@jjenzz) for the original implementation.
 * Incredible thought must have went into solving all the intricacies of this component.
 */
import type { ScrollAreaType } from "./types.js";
import type { ReadableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
import { type Direction, type Orientation } from "../../shared/index.js";
type Sizes = {
    content: number;
    viewport: number;
    scrollbar: {
        size: number;
        paddingStart: number;
        paddingEnd: number;
    };
};
type ScrollAreaRootStateProps = WithRefProps<ReadableBoxedValues<{
    dir: Direction;
    type: ScrollAreaType;
    scrollHideDelay: number;
}>>;
declare class ScrollAreaRootState {
    #private;
    dir: ScrollAreaRootStateProps["dir"];
    type: ScrollAreaRootStateProps["type"];
    scrollHideDelay: ScrollAreaRootStateProps["scrollHideDelay"];
    scrollAreaNode: HTMLElement | null;
    viewportNode: HTMLElement | null;
    contentNode: HTMLElement | null;
    scrollbarXNode: HTMLElement | null;
    scrollbarYNode: HTMLElement | null;
    cornerWidth: number;
    cornerHeight: number;
    scrollbarXEnabled: boolean;
    scrollbarYEnabled: boolean;
    constructor(props: ScrollAreaRootStateProps);
    props: {
        readonly id: string;
        readonly dir: Direction;
        readonly style: {
            readonly position: "relative";
            readonly "--bits-scroll-area-corner-height": `${number}px`;
            readonly "--bits-scroll-area-corner-width": `${number}px`;
        };
        readonly "data-scroll-area-root": "";
    };
}
type ScrollAreaViewportStateProps = WithRefProps;
declare class ScrollAreaViewportState {
    #private;
    root: ScrollAreaRootState;
    constructor(props: ScrollAreaViewportStateProps, root: ScrollAreaRootState);
    props: {
        readonly id: string;
        readonly style: {
            readonly overflowX: "hidden" | "scroll";
            readonly overflowY: "hidden" | "scroll";
        };
        readonly "data-scroll-area-viewport": "";
    };
    contentProps: {
        readonly id: string;
        readonly "data-scroll-area-content": "";
        /**
         * When horizontal scrollbar is visible: this element should be at least
         * as wide as its children for size calculations to work correctly.
         *
         * When horizontal scrollbar is NOT visible: this element's width should
         * be constrained by the parent container to enable `text-overflow: ellipsis`
         */
        readonly style: {
            readonly minWidth: "fit-content" | undefined;
        };
    };
}
type ScrollAreaScrollbarStateProps = WithRefProps<ReadableBoxedValues<{
    orientation: Orientation;
}>>;
declare class ScrollAreaScrollbarState {
    ref: ScrollAreaScrollbarStateProps["ref"];
    id: ScrollAreaScrollbarStateProps["id"];
    root: ScrollAreaRootState;
    orientation: ScrollAreaScrollbarStateProps["orientation"];
    isHorizontal: boolean;
    hasThumb: boolean;
    constructor(props: ScrollAreaScrollbarStateProps, root: ScrollAreaRootState);
}
declare class ScrollAreaScrollbarHoverState {
    root: ScrollAreaRootState;
    isVisible: boolean;
    scrollbar: ScrollAreaScrollbarState;
    constructor(scrollbar: ScrollAreaScrollbarState);
    props: {
        readonly "data-state": "hidden" | "visible";
    };
}
declare class ScrollAreaScrollbarScrollState {
    #private;
    orientation: ScrollAreaScrollbarState["orientation"];
    root: ScrollAreaRootState;
    scrollbar: ScrollAreaScrollbarState;
    machine: {
        state: import("svelte-toolbelt").WritableBox<"hidden" | "scrolling" | "idle" | "interacting">;
        dispatch: (event: string | number | symbol) => void;
    };
    isHidden: boolean;
    constructor(scrollbar: ScrollAreaScrollbarState);
    props: {
        readonly "data-state": "hidden" | "visible";
        readonly onpointerenter: () => void;
        readonly onpointerleave: () => void;
    };
}
declare class ScrollAreaScrollbarAutoState {
    scrollbar: ScrollAreaScrollbarState;
    root: ScrollAreaRootState;
    isVisible: boolean;
    constructor(scrollbar: ScrollAreaScrollbarState);
    props: {
        readonly "data-state": "hidden" | "visible";
    };
}
declare class ScrollAreaScrollbarVisibleState {
    scrollbar: ScrollAreaScrollbarState;
    root: ScrollAreaRootState;
    thumbNode: HTMLElement | null;
    pointerOffset: number;
    sizes: Sizes;
    thumbRatio: number;
    hasThumb: boolean;
    prevTransformStyle: string;
    constructor(scrollbar: ScrollAreaScrollbarState);
    setSizes: (sizes: Sizes) => void;
    getScrollPosition: (pointerPos: number, dir?: Direction) => number;
    onThumbPointerUp: () => void;
    onThumbPointerDown: (pointerPos: number) => void;
    xOnThumbPositionChange: () => void;
    xOnWheelScroll: (scrollPos: number) => void;
    xOnDragScroll: (pointerPos: number) => void;
    yOnThumbPositionChange: () => void;
    yOnWheelScroll: (scrollPos: number) => void;
    yOnDragScroll: (pointerPos: number) => void;
}
type ScrollbarAxisStateProps = ReadableBoxedValues<{
    mounted: boolean;
}>;
type ScrollbarAxisState = {
    onThumbPointerDown: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onDragScroll: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
    onResize: () => void;
    onThumbPositionChange: () => void;
    onThumbPointerUp: () => void;
    props: {
        id: string;
        "data-orientation": "horizontal" | "vertical";
        style: Record<string, string | number | undefined>;
    };
};
declare class ScrollAreaScrollbarXState implements ScrollbarAxisState {
    #private;
    ref: WithRefProps["ref"];
    scrollbarVis: ScrollAreaScrollbarVisibleState;
    root: ScrollAreaRootState;
    computedStyle: CSSStyleDeclaration | undefined;
    constructor(props: ScrollbarAxisStateProps, scrollbarVis: ScrollAreaScrollbarVisibleState);
    onThumbPointerDown: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onDragScroll: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onThumbPointerUp: () => void;
    onThumbPositionChange: () => void;
    onWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
    onResize: () => void;
    thumbSize: number;
    props: {
        readonly id: string;
        readonly "data-orientation": "horizontal";
        readonly style: {
            readonly bottom: 0;
            readonly left: 0 | "var(--bits-scroll-area-corner-width)";
            readonly right: 0 | "var(--bits-scroll-area-corner-width)";
            readonly "--bits-scroll-area-thumb-width": `${number}px`;
        };
    };
}
declare class ScrollAreaScrollbarYState implements ScrollbarAxisState {
    #private;
    ref: WithRefProps["ref"];
    scrollbarVis: ScrollAreaScrollbarVisibleState;
    root: ScrollAreaRootState;
    computedStyle: CSSStyleDeclaration | undefined;
    constructor(props: ScrollbarAxisStateProps, scrollbarVis: ScrollAreaScrollbarVisibleState);
    onThumbPointerDown: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onDragScroll: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    onThumbPointerUp: () => void;
    onThumbPositionChange: () => void;
    onWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
    onResize: () => void;
    thumbSize: number;
    props: {
        readonly id: string;
        readonly "data-orientation": "vertical";
        readonly style: {
            readonly top: 0;
            readonly right: 0 | undefined;
            readonly left: 0 | undefined;
            readonly bottom: "var(--bits-scroll-area-corner-height)";
            readonly "--bits-scroll-area-thumb-height": `${number}px`;
        };
    };
}
type ScrollbarAxis = ScrollAreaScrollbarXState | ScrollAreaScrollbarYState;
declare class ScrollAreaScrollbarSharedState {
    #private;
    scrollbarState: ScrollbarAxis;
    root: ScrollAreaRootState;
    scrollbarVis: ScrollAreaScrollbarVisibleState;
    rect: DOMRect | null;
    prevWebkitUserSelect: string;
    handleResize: () => void;
    handleThumbPositionChange: () => void;
    handleWheelScroll: (e: WheelEvent, maxScrollPos: number) => void;
    handleThumbPointerDown: (pointerPos: {
        x: number;
        y: number;
    }) => void;
    handleThumbPointerUp: () => void;
    maxScrollPos: number;
    constructor(scrollbarState: ScrollbarAxis);
    handleDragScroll: (e: PointerEvent) => void;
    props: never;
}
type ScrollAreaThumbImplStateProps = WithRefProps & ReadableBoxedValues<{
    mounted: boolean;
}>;
declare class ScrollAreaThumbImplState {
    #private;
    constructor(props: ScrollAreaThumbImplStateProps, scrollbarState: ScrollAreaScrollbarSharedState);
    props: {
        readonly id: string;
        readonly "data-state": "hidden" | "visible";
        readonly style: {
            readonly width: "var(--bits-scroll-area-thumb-width)";
            readonly height: "var(--bits-scroll-area-thumb-height)";
            readonly transform: string;
        };
        readonly onpointerdowncapture: (e: PointerEvent) => void;
        readonly onpointerup: () => void;
        readonly "data-scroll-area-thumb": "";
    };
}
type ScrollAreaCornerImplStateProps = WithRefProps;
declare class ScrollAreaCornerImplState {
    #private;
    hasSize: boolean;
    constructor(props: ScrollAreaCornerImplStateProps, root: ScrollAreaRootState);
    props: {
        id: string;
        style: {
            width: number;
            height: number;
            position: string;
            right: number | undefined;
            left: number | undefined;
            bottom: number;
        };
        "data-scroll-area-corner": string;
    };
}
export declare const setScrollAreaRootContext: (value: ScrollAreaRootState) => ScrollAreaRootState, getScrollAreaRootContext: <T extends ScrollAreaRootState | null | undefined = ScrollAreaRootState>(fallback?: T | undefined) => T extends null ? ScrollAreaRootState | null : ScrollAreaRootState;
export declare const setScrollAreaScrollbarContext: (value: ScrollAreaScrollbarState) => ScrollAreaScrollbarState, getScrollAreaScrollbarContext: <T extends ScrollAreaScrollbarState | null | undefined = ScrollAreaScrollbarState>(fallback?: T | undefined) => T extends null ? ScrollAreaScrollbarState | null : ScrollAreaScrollbarState;
export declare const setScrollAreaScrollbarVisibleContext: (value: ScrollAreaScrollbarVisibleState) => ScrollAreaScrollbarVisibleState, getScrollAreaScrollbarVisibleContext: <T extends ScrollAreaScrollbarVisibleState | null | undefined = ScrollAreaScrollbarVisibleState>(fallback?: T | undefined) => T extends null ? ScrollAreaScrollbarVisibleState | null : ScrollAreaScrollbarVisibleState;
export declare const setScrollAreaScrollbarAxisContext: (value: ScrollbarAxis) => ScrollbarAxis, getScrollAreaScrollbarAxisContext: <T extends ScrollbarAxis | null | undefined = ScrollbarAxis>(fallback?: T | undefined) => T extends null ? ScrollbarAxis | null : ScrollbarAxis;
export declare const setScrollAreaScrollbarSharedContext: (value: ScrollAreaScrollbarSharedState) => ScrollAreaScrollbarSharedState, getScrollAreaScrollbarSharedContext: <T extends ScrollAreaScrollbarSharedState | null | undefined = ScrollAreaScrollbarSharedState>(fallback?: T | undefined) => T extends null ? ScrollAreaScrollbarSharedState | null : ScrollAreaScrollbarSharedState;
export declare function useScrollAreaRoot(props: ScrollAreaRootStateProps): ScrollAreaRootState;
export declare function useScrollAreaViewport(props: ScrollAreaViewportStateProps): ScrollAreaViewportState;
export declare function useScrollAreaScrollbar(props: ScrollAreaScrollbarStateProps): ScrollAreaScrollbarState;
export declare function useScrollAreaScrollbarVisible(): ScrollAreaScrollbarVisibleState;
export declare function useScrollAreaScrollbarAuto(): ScrollAreaScrollbarAutoState;
export declare function useScrollAreaScrollbarScroll(): ScrollAreaScrollbarScrollState;
export declare function useScrollAreaScrollbarHover(): ScrollAreaScrollbarHoverState;
export declare function useScrollAreaScrollbarX(props: ScrollbarAxisStateProps): ScrollbarAxis;
export declare function useScrollAreaScrollbarY(props: ScrollbarAxisStateProps): ScrollbarAxis;
export declare function useScrollAreaScrollbarShared(): ScrollAreaScrollbarSharedState;
export declare function useScrollAreaThumb(props: ScrollAreaThumbImplStateProps): ScrollAreaThumbImplState;
export declare function useScrollAreaCorner(props: ScrollAreaCornerImplStateProps): ScrollAreaCornerImplState;
export {};
