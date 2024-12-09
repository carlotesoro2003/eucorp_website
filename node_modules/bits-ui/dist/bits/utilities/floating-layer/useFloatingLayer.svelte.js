import { untrack } from "svelte";
import { arrow, autoUpdate, flip, hide, limitShift, offset, shift, size, } from "@floating-ui/dom";
import { box, cssToStyleObj, styleToString, useRefById } from "svelte-toolbelt";
import { ElementSize } from "runed";
import { isNotNull } from "../../../internal/is.js";
import { useId } from "../../../internal/use-id.js";
import { useFloating } from "../../../internal/floating-svelte/use-floating.svelte.js";
import { createContext } from "../../../internal/create-context.js";
export const SIDE_OPTIONS = ["top", "right", "bottom", "left"];
export const ALIGN_OPTIONS = ["start", "center", "end"];
const OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
};
class FloatingRootState {
    anchorNode = box(null);
    customAnchorNode = box(null);
    triggerNode = box(null);
    constructor() {
        $effect(() => {
            if (this.customAnchorNode.current) {
                if (typeof this.customAnchorNode.current === "string") {
                    this.anchorNode.current = document.querySelector(this.customAnchorNode.current);
                }
                else {
                    this.anchorNode.current = this.customAnchorNode.current;
                }
            }
            else {
                this.anchorNode.current = this.triggerNode.current;
            }
        });
    }
}
class FloatingContentState {
    // state
    root;
    // nodes
    contentRef = box(null);
    wrapperRef = box(null);
    arrowRef = box(null);
    // ids
    arrowId = box(useId());
    id;
    wrapperId;
    style;
    #transformedStyle = $derived.by(() => {
        if (typeof this.style === "string")
            return cssToStyleObj(this.style);
        if (!this.style)
            return {};
    });
    #dir;
    #side;
    #sideOffset;
    #align;
    #alignOffset;
    #arrowPadding;
    #avoidCollisions;
    #collisionBoundary;
    #collisionPadding;
    #sticky;
    #hideWhenDetached;
    #strategy;
    #updatePositionStrategy = undefined;
    onPlaced;
    enabled;
    #arrowSize = new ElementSize(() => this.arrowRef.current ?? undefined);
    #arrowWidth = $derived(this.#arrowSize?.width ?? 0);
    #arrowHeight = $derived(this.#arrowSize?.height ?? 0);
    #desiredPlacement = $derived.by(() => (this.#side?.current +
        (this.#align.current !== "center" ? `-${this.#align.current}` : "")));
    #boundary = $derived.by(() => Array.isArray(this.#collisionBoundary.current)
        ? this.#collisionBoundary.current
        : [this.#collisionBoundary.current]);
    hasExplicitBoundaries = $derived(this.#boundary.length > 0);
    detectOverflowOptions = $derived.by(() => ({
        padding: this.#collisionPadding.current,
        boundary: this.#boundary.filter(isNotNull),
        altBoundary: this.hasExplicitBoundaries,
    }));
    #availableWidth = $state(undefined);
    #availableHeight = $state(undefined);
    #anchorWidth = $state(undefined);
    #anchorHeight = $state(undefined);
    middleware = $derived.by(() => [
        offset({
            mainAxis: this.#sideOffset.current + this.#arrowHeight,
            alignmentAxis: this.#alignOffset.current,
        }),
        this.#avoidCollisions &&
            shift({
                mainAxis: true,
                crossAxis: false,
                limiter: this.#sticky.current === "partial" ? limitShift() : undefined,
                ...this.detectOverflowOptions,
            }),
        this.#avoidCollisions && flip({ ...this.detectOverflowOptions }),
        size({
            ...this.detectOverflowOptions,
            apply: ({ rects, availableWidth, availableHeight }) => {
                const { width: anchorWidth, height: anchorHeight } = rects.reference;
                this.#availableWidth = availableWidth;
                this.#availableHeight = availableHeight;
                this.#anchorWidth = anchorWidth;
                this.#anchorHeight = anchorHeight;
            },
        }),
        this.arrowRef.current &&
            arrow({ element: this.arrowRef.current, padding: this.#arrowPadding.current }),
        transformOrigin({ arrowWidth: this.#arrowWidth, arrowHeight: this.#arrowHeight }),
        this.#hideWhenDetached.current &&
            hide({ strategy: "referenceHidden", ...this.detectOverflowOptions }),
    ].filter(Boolean));
    floating;
    placedSide = $derived.by(() => getSideFromPlacement(this.floating.placement));
    placedAlign = $derived.by(() => getAlignFromPlacement(this.floating.placement));
    arrowX = $derived.by(() => this.floating.middlewareData.arrow?.x ?? 0);
    arrowY = $derived.by(() => this.floating.middlewareData.arrow?.y ?? 0);
    cannotCenterArrow = $derived.by(() => this.floating.middlewareData.arrow?.centerOffset !== 0);
    contentZIndex = $state();
    arrowBaseSide = $derived(OPPOSITE_SIDE[this.placedSide]);
    wrapperProps = $derived.by(() => ({
        id: this.wrapperId.current,
        "data-bits-floating-content-wrapper": "",
        style: {
            ...this.floating.floatingStyles,
            // keep off page when measuring
            transform: this.floating.isPositioned
                ? this.floating.floatingStyles.transform
                : "translate(0, -200%)",
            minWidth: "max-content",
            zIndex: this.contentZIndex,
            "--bits-floating-transform-origin": `${this.floating.middlewareData.transformOrigin?.x} ${this.floating.middlewareData.transformOrigin?.y}`,
            "--bits-floating-available-width": `${this.#availableWidth}px`,
            "--bits-floating-available-height": `${this.#availableHeight}px`,
            "--bits-floating-anchor-width": `${this.#anchorWidth}px`,
            "--bits-floating-anchor-height": `${this.#anchorHeight}px`,
            // hide the content if using the hide middleware and should be hidden
            ...(this.floating.middlewareData.hide?.referenceHidden && {
                visibility: "hidden",
                "pointer-events": "none",
            }),
            ...this.#transformedStyle,
        },
        // Floating UI calculates logical alignment based the `dir` attribute
        dir: this.#dir.current,
    }));
    props = $derived.by(() => ({
        "data-side": this.placedSide,
        "data-align": this.placedAlign,
        style: styleToString({
            ...this.#transformedStyle,
            // if the FloatingContent hasn't been placed yet (not all measurements done)
            // we prevent animations so that users's animation don't kick in too early referring wrong sides
            // animation: !this.floating.isPositioned ? "none" : undefined,
        }),
    }));
    arrowStyle = $derived({
        position: "absolute",
        left: this.arrowX ? `${this.arrowX}px` : undefined,
        top: this.arrowY ? `${this.arrowY}px` : undefined,
        [this.arrowBaseSide]: 0,
        "transform-origin": {
            top: "",
            right: "0 0",
            bottom: "center 0",
            left: "100% 0",
        }[this.placedSide],
        transform: {
            top: "translateY(100%)",
            right: "translateY(50%) rotate(90deg) translateX(-50%)",
            bottom: "rotate(180deg)",
            left: "translateY(50%) rotate(-90deg) translateX(50%)",
        }[this.placedSide],
        visibility: this.cannotCenterArrow ? "hidden" : undefined,
    });
    constructor(props, root) {
        this.id = props.id;
        this.#side = props.side;
        this.#sideOffset = props.sideOffset;
        this.#align = props.align;
        this.#alignOffset = props.alignOffset;
        this.#arrowPadding = props.arrowPadding;
        this.#avoidCollisions = props.avoidCollisions;
        this.#collisionBoundary = props.collisionBoundary;
        this.#collisionPadding = props.collisionPadding;
        this.#sticky = props.sticky;
        this.#hideWhenDetached = props.hideWhenDetached;
        this.#updatePositionStrategy = props.updatePositionStrategy;
        this.onPlaced = props.onPlaced;
        this.#strategy = props.strategy;
        this.#dir = props.dir;
        this.style = props.style;
        this.root = root;
        this.enabled = props.enabled;
        this.wrapperId = props.wrapperId;
        if (props.customAnchor) {
            this.root.customAnchorNode.current = props.customAnchor.current;
        }
        $effect(() => {
            props.customAnchor.current;
            untrack(() => {
                this.root.customAnchorNode.current = props.customAnchor.current;
            });
        });
        useRefById({
            id: this.wrapperId,
            ref: this.wrapperRef,
            deps: () => this.enabled.current,
        });
        useRefById({
            id: this.id,
            ref: this.contentRef,
            deps: () => this.enabled.current,
        });
        this.floating = useFloating({
            strategy: () => this.#strategy.current,
            placement: () => this.#desiredPlacement,
            middleware: () => this.middleware,
            reference: this.root.anchorNode,
            whileElementsMounted: (...args) => {
                const cleanup = autoUpdate(...args, {
                    animationFrame: this.#updatePositionStrategy?.current === "always",
                });
                return cleanup;
            },
            open: () => this.enabled.current,
        });
        $effect(() => {
            if (!this.floating.isPositioned)
                return;
            this.onPlaced?.current();
        });
        $effect(() => {
            const contentNode = this.contentRef.current;
            if (!contentNode)
                return;
            untrack(() => {
                this.contentZIndex = window.getComputedStyle(contentNode).zIndex;
            });
        });
        $effect(() => {
            this.floating.floating.current = this.wrapperRef.current;
        });
    }
}
class FloatingArrowState {
    #id;
    #ref;
    #content;
    constructor(props, content) {
        this.#content = content;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            onRefChange: (node) => {
                this.#content.arrowRef.current = node;
            },
            deps: () => this.#content.enabled.current,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        style: this.#content.arrowStyle,
        "data-side": this.#content.placedSide,
    }));
}
class FloatingAnchorState {
    ref = box(null);
    constructor(props, root) {
        if (props.virtualEl && props.virtualEl.current) {
            root.triggerNode = box.from(props.virtualEl.current);
        }
        else {
            useRefById({
                id: props.id,
                ref: this.ref,
                onRefChange: (node) => {
                    root.triggerNode.current = node;
                },
            });
        }
    }
}
//
// CONTEXT METHODS
//
const [setFloatingRootContext, getFloatingRootContext] = createContext("Floating.Root");
const [setFloatingContentContext, getFloatingContentContext] = createContext("Floating.Content");
export function useFloatingRootState() {
    return setFloatingRootContext(new FloatingRootState());
}
export function useFloatingContentState(props) {
    return setFloatingContentContext(new FloatingContentState(props, getFloatingRootContext()));
}
export function useFloatingArrowState(props) {
    return new FloatingArrowState(props, getFloatingContentContext());
}
export function useFloatingAnchorState(props) {
    return new FloatingAnchorState(props, getFloatingRootContext());
}
//
// HELPERS
//
function transformOrigin(options) {
    return {
        name: "transformOrigin",
        options,
        fn(data) {
            const { placement, rects, middlewareData } = data;
            const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
            const isArrowHidden = cannotCenterArrow;
            const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
            const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
            const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
            const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
            const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
            const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
            let x = "";
            let y = "";
            if (placedSide === "bottom") {
                x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y = `${-arrowHeight}px`;
            }
            else if (placedSide === "top") {
                x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
                y = `${rects.floating.height + arrowHeight}px`;
            }
            else if (placedSide === "right") {
                x = `${-arrowHeight}px`;
                y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            }
            else if (placedSide === "left") {
                x = `${rects.floating.width + arrowHeight}px`;
                y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
            }
            return { data: { x, y } };
        },
    };
}
function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
}
export function getSideFromPlacement(placement) {
    return getSideAndAlignFromPlacement(placement)[0];
}
export function getAlignFromPlacement(placement) {
    return getSideAndAlignFromPlacement(placement)[1];
}
