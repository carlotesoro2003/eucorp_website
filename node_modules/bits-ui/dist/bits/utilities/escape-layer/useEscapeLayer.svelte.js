import { untrack } from "svelte";
import { addEventListener } from "../../../internal/events.js";
import { kbd } from "../../../internal/kbd.js";
import { noop } from "../../../internal/noop.js";
globalThis.bitsEscapeLayers ??= new Map();
export class EscapeLayerState {
    #onEscapeProp;
    #behaviorType;
    #enabled;
    constructor(props) {
        this.#behaviorType = props.escapeKeydownBehavior;
        this.#onEscapeProp = props.onEscapeKeydown;
        this.#enabled = props.enabled;
        let unsubEvents = noop;
        $effect(() => {
            if (this.#enabled.current) {
                globalThis.bitsEscapeLayers.set(this, untrack(() => this.#behaviorType));
                unsubEvents = this.#addEventListener();
            }
            return () => {
                unsubEvents();
                globalThis.bitsEscapeLayers.delete(this);
            };
        });
    }
    #addEventListener = () => {
        return addEventListener(document, "keydown", this.#onkeydown, { passive: false });
    };
    #onkeydown = (e) => {
        if (e.key !== kbd.ESCAPE || !isResponsibleEscapeLayer(this))
            return;
        const clonedEvent = new KeyboardEvent(e.type, e);
        e.preventDefault();
        const behaviorType = this.#behaviorType.current;
        if (behaviorType !== "close" && behaviorType !== "defer-otherwise-close")
            return;
        this.#onEscapeProp.current(clonedEvent);
    };
}
export function useEscapeLayer(props) {
    return new EscapeLayerState(props);
}
function isResponsibleEscapeLayer(instance) {
    const layersArr = [...globalThis.bitsEscapeLayers];
    /**
     * We first check if we can find a top layer with `close` or `ignore`.
     * If that top layer was found and matches the provided node, then the node is
     * responsible for the escape. Otherwise, we know that all layers defer so
     * the first layer is the responsible one.
     */
    const topMostLayer = layersArr.findLast(([_, { current: behaviorType }]) => behaviorType === "close" || behaviorType === "ignore");
    if (topMostLayer)
        return topMostLayer[0] === instance;
    const [firstLayerNode] = layersArr[0];
    return firstLayerNode === instance;
}
