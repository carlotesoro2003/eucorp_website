import { untrack } from "svelte";
import { afterSleep, afterTick, box, executeCallbacks, onDestroyEffect, useRefById, } from "svelte-toolbelt";
import { addEventListener } from "../../../internal/events.js";
import { debounce } from "../../../internal/debounce.js";
import { noop } from "../../../internal/noop.js";
import { getOwnerDocument, isOrContainsTarget } from "../../../internal/elements.js";
import { isElement } from "../../../internal/is.js";
globalThis.bitsDismissableLayers ??= new Map();
export class DismissibleLayerState {
    #interactOutsideProp;
    #behaviorType;
    #interceptedEvents = {
        pointerdown: false,
    };
    #isResponsibleLayer = false;
    node = box(null);
    #documentObj = undefined;
    #enabled;
    #isFocusInsideDOMTree = $state(false);
    #onFocusOutside;
    currNode = $state(null);
    #isValidEventProp;
    #unsubClickListener = noop;
    constructor(props) {
        this.#enabled = props.enabled;
        this.#isValidEventProp = props.isValidEvent;
        useRefById({
            id: props.id,
            ref: this.node,
            deps: () => this.#enabled.current,
            onRefChange: (node) => {
                this.currNode = node;
            },
        });
        this.#behaviorType = props.interactOutsideBehavior;
        this.#interactOutsideProp = props.onInteractOutside;
        this.#onFocusOutside = props.onFocusOutside;
        $effect(() => {
            this.#documentObj = getOwnerDocument(this.currNode);
        });
        let unsubEvents = noop;
        const cleanup = () => {
            this.#resetState();
            globalThis.bitsDismissableLayers.delete(this);
            this.#handleInteractOutside.destroy();
            unsubEvents();
        };
        $effect(() => {
            if (this.#enabled.current && this.currNode) {
                afterSleep(1, () => {
                    if (!this.currNode)
                        return;
                    globalThis.bitsDismissableLayers.set(this, untrack(() => this.#behaviorType));
                    unsubEvents();
                    unsubEvents = this.#addEventListeners();
                });
            }
            return () => {
                cleanup();
            };
        });
        onDestroyEffect(() => {
            this.#resetState.destroy();
            globalThis.bitsDismissableLayers.delete(this);
            this.#handleInteractOutside.destroy();
            this.#unsubClickListener();
            unsubEvents();
        });
    }
    #handleFocus = (event) => {
        if (event.defaultPrevented)
            return;
        if (!this.currNode)
            return;
        afterTick(() => {
            if (!this.currNode || this.#isTargetWithinLayer(event.target))
                return;
            if (event.target && !this.#isFocusInsideDOMTree) {
                this.#onFocusOutside.current?.(event);
            }
        });
    };
    #addEventListeners() {
        return executeCallbacks(
        /**
         * CAPTURE INTERACTION START
         * mark interaction-start event as intercepted.
         * mark responsible layer during interaction start
         * to avoid checking if is responsible layer during interaction end
         * when a new floating element may have been opened.
         */
        addEventListener(this.#documentObj, "pointerdown", executeCallbacks(this.#markInterceptedEvent, this.#markResponsibleLayer), true), 
        /**
         * BUBBLE INTERACTION START
         * Mark interaction-start event as non-intercepted. Debounce `onInteractOutsideStart`
         * to avoid prematurely checking if other events were intercepted.
         */
        addEventListener(this.#documentObj, "pointerdown", executeCallbacks(this.#markNonInterceptedEvent, this.#handleInteractOutside)), 
        /**
         * HANDLE FOCUS OUTSIDE
         */
        addEventListener(this.#documentObj, "focusin", this.#handleFocus));
    }
    #handleDismiss = (e) => {
        let event = e;
        if (event.defaultPrevented) {
            event = createWrappedEvent(e);
        }
        this.#interactOutsideProp.current(e);
    };
    #handleInteractOutside = debounce((e) => {
        if (!this.currNode) {
            this.#unsubClickListener();
            return;
        }
        const isEventValid = this.#isValidEventProp.current(e, this.currNode) || isValidEvent(e, this.currNode);
        if (!this.#isResponsibleLayer || this.#isAnyEventIntercepted() || !isEventValid) {
            this.#unsubClickListener();
            return;
        }
        let event = e;
        if (event.defaultPrevented) {
            event = createWrappedEvent(event);
        }
        if (this.#behaviorType.current !== "close" &&
            this.#behaviorType.current !== "defer-otherwise-close") {
            this.#unsubClickListener();
            return;
        }
        if (e.pointerType === "touch") {
            this.#unsubClickListener();
            // @ts-expect-error - later
            this.#unsubClickListener = addEventListener(this.#documentObj, "click", this.#handleDismiss, { once: true });
        }
        else {
            this.#interactOutsideProp.current(event);
        }
    }, 10);
    #markInterceptedEvent = (e) => {
        this.#interceptedEvents[e.type] = true;
    };
    #markNonInterceptedEvent = (e) => {
        this.#interceptedEvents[e.type] = false;
    };
    #markResponsibleLayer = () => {
        if (!this.node.current)
            return;
        this.#isResponsibleLayer = isResponsibleLayer(this.node.current);
    };
    #isTargetWithinLayer = (target) => {
        if (!this.node.current)
            return false;
        return isOrContainsTarget(this.node.current, target);
    };
    #resetState = debounce(() => {
        for (const eventType in this.#interceptedEvents) {
            this.#interceptedEvents[eventType] = false;
        }
        this.#isResponsibleLayer = false;
    }, 20);
    #isAnyEventIntercepted() {
        const i = Object.values(this.#interceptedEvents).some(Boolean);
        return i;
    }
    #onfocuscapture = () => {
        this.#isFocusInsideDOMTree = true;
    };
    #onblurcapture = () => {
        this.#isFocusInsideDOMTree = false;
    };
    props = {
        onfocuscapture: this.#onfocuscapture,
        onblurcapture: this.#onblurcapture,
    };
}
export function useDismissibleLayer(props) {
    return new DismissibleLayerState(props);
}
function getTopMostLayer(layersArr) {
    return layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
}
function isResponsibleLayer(node) {
    const layersArr = [...globalThis.bitsDismissableLayers];
    /**
     * We first check if we can find a top layer with `close` or `ignore`.
     * If that top layer was found and matches the provided node, then the node is
     * responsible for the outside interaction. Otherwise, we know that all layers defer so
     * the first layer is the responsible one.
     */
    const topMostLayer = getTopMostLayer(layersArr);
    if (topMostLayer)
        return topMostLayer[0].node.current === node;
    const [firstLayerNode] = layersArr[0];
    return firstLayerNode.node.current === node;
}
function isValidEvent(e, node) {
    if ("button" in e && e.button > 0)
        return false;
    const target = e.target;
    if (!isElement(target))
        return false;
    const ownerDocument = getOwnerDocument(target);
    const isValid = ownerDocument.documentElement.contains(target) && !isOrContainsTarget(node, target);
    return isValid;
}
function createWrappedEvent(e) {
    const capturedCurrentTarget = e.currentTarget;
    const capturedTarget = e.target;
    let newEvent;
    if (e instanceof PointerEvent) {
        newEvent = new PointerEvent(e.type, e);
    }
    else {
        newEvent = new PointerEvent("pointerdown", e);
    }
    // track the prevented state separately
    let isPrevented = false;
    // Create a proxy to intercept property access and method calls
    const wrappedEvent = new Proxy(newEvent, {
        get: (target, prop) => {
            if (prop === "currentTarget") {
                return capturedCurrentTarget;
            }
            if (prop === "target") {
                return capturedTarget;
            }
            if (prop === "preventDefault") {
                return () => {
                    isPrevented = true;
                    if (typeof target.preventDefault === "function") {
                        target.preventDefault();
                    }
                };
            }
            if (prop === "defaultPrevented") {
                return isPrevented;
            }
            if (prop in target) {
                // eslint-disable-next-line ts/no-explicit-any
                return target[prop];
            }
            // eslint-disable-next-line ts/no-explicit-any
            return e[prop];
        },
    });
    return wrappedEvent;
}
