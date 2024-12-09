import { afterTick, useRefById } from "svelte-toolbelt";
import { getAriaExpanded, getDataDisabled, getDataOpenClosed } from "../../internal/attrs.js";
import { createContext } from "../../internal/create-context.js";
import { kbd } from "../../internal/kbd.js";
const COLLAPSIBLE_ROOT_ATTR = "data-collapsible-root";
const COLLAPSIBLE_CONTENT_ATTR = "data-collapsible-content";
const COLLAPSIBLE_TRIGGER_ATTR = "data-collapsible-trigger";
class CollapsibleRootState {
    #id;
    #ref;
    open;
    disabled;
    contentNode = $state(null);
    contentId = $state(undefined);
    constructor(props) {
        this.open = props.open;
        this.disabled = props.disabled;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    toggleOpen() {
        this.open.current = !this.open.current;
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        "data-state": getDataOpenClosed(this.open.current),
        "data-disabled": getDataDisabled(this.disabled.current),
        [COLLAPSIBLE_ROOT_ATTR]: "",
    }));
}
class CollapsibleContentState {
    #id;
    #ref;
    root;
    #originalStyles;
    #isMountAnimationPrevented = $state(false);
    #width = $state(0);
    #height = $state(0);
    #forceMount;
    present = $derived.by(() => this.#forceMount.current || this.root.open.current);
    constructor(props, root) {
        this.root = root;
        this.#isMountAnimationPrevented = root.open.current;
        this.#forceMount = props.forceMount;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.present,
            onRefChange: (node) => {
                this.root.contentNode = node;
                this.root.contentId = node?.id;
            },
        });
        $effect.pre(() => {
            const rAF = requestAnimationFrame(() => {
                this.#isMountAnimationPrevented = false;
            });
            return () => {
                cancelAnimationFrame(rAF);
            };
        });
        $effect(() => {
            this.present;
            const node = this.#ref.current;
            if (!node)
                return;
            afterTick(() => {
                if (!this.#ref.current)
                    return;
                // get the dimensions of the element
                this.#originalStyles = this.#originalStyles || {
                    transitionDuration: node.style.transitionDuration,
                    animationName: node.style.animationName,
                };
                // block any animations/transitions so the element renders at full dimensions
                node.style.transitionDuration = "0s";
                node.style.animationName = "none";
                const rect = node.getBoundingClientRect();
                this.#height = rect.height;
                this.#width = rect.width;
                // unblock any animations/transitions that were originally set if not the initial render
                if (!this.#isMountAnimationPrevented) {
                    const { animationName, transitionDuration } = this.#originalStyles;
                    node.style.transitionDuration = transitionDuration;
                    node.style.animationName = animationName;
                }
            });
        });
    }
    snippetProps = $derived.by(() => ({
        open: this.root.open.current,
    }));
    props = $derived.by(() => ({
        id: this.#id.current,
        style: {
            "--bits-collapsible-content-height": this.#height
                ? `${this.#height}px`
                : undefined,
            "--bits-collapsible-content-width": this.#width
                ? `${this.#width}px`
                : undefined,
        },
        "data-state": getDataOpenClosed(this.root.open.current),
        "data-disabled": getDataDisabled(this.root.disabled.current),
        [COLLAPSIBLE_CONTENT_ATTR]: "",
    }));
}
class CollapsibleTriggerState {
    #root;
    #ref;
    #id;
    #disabled;
    #isDisabled = $derived.by(() => this.#disabled.current || this.#root.disabled.current);
    constructor(props, root) {
        this.#root = root;
        this.#id = props.id;
        this.#ref = props.ref;
        this.#disabled = props.disabled;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    #onpointerdown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.pointerType === "touch" || e.button !== 0)
            return e.preventDefault();
        this.#root.toggleOpen();
    };
    #onpointerup = (e) => {
        if (this.#isDisabled)
            return;
        if (e.pointerType === "touch") {
            e.preventDefault();
            this.#root.toggleOpen();
        }
    };
    #onkeydown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            this.#root.toggleOpen();
        }
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        type: "button",
        disabled: this.#isDisabled,
        "aria-controls": this.#root.contentId,
        "aria-expanded": getAriaExpanded(this.#root.open.current),
        "data-state": getDataOpenClosed(this.#root.open.current),
        "data-disabled": getDataDisabled(this.#isDisabled),
        [COLLAPSIBLE_TRIGGER_ATTR]: "",
        //
        onpointerdown: this.#onpointerdown,
        onpointerup: this.#onpointerup,
        onkeydown: this.#onkeydown,
    }));
}
const [setCollapsibleRootContext, getCollapsibleRootContext] = createContext("Collapsible.Root");
export function useCollapsibleRoot(props) {
    return setCollapsibleRootContext(new CollapsibleRootState(props));
}
export function useCollapsibleTrigger(props) {
    const root = getCollapsibleRootContext();
    return new CollapsibleTriggerState(props, root);
}
export function useCollapsibleContent(props) {
    const root = getCollapsibleRootContext();
    return new CollapsibleContentState(props, root);
}
