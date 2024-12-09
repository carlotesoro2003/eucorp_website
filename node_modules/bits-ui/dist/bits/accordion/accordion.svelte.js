import { afterTick, useRefById } from "svelte-toolbelt";
import { getAriaDisabled, getAriaExpanded, getDataDisabled, getDataOpenClosed, getDataOrientation, } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
import { useRovingFocus, } from "../../internal/use-roving-focus.svelte.js";
import { createContext } from "../../internal/create-context.js";
const ACCORDION_ROOT_ATTR = "data-accordion-root";
const ACCORDION_TRIGGER_ATTR = "data-accordion-trigger";
const ACCORDION_CONTENT_ATTR = "data-accordion-content";
const ACCORDION_ITEM_ATTR = "data-accordion-item";
const ACCORDION_HEADER_ATTR = "data-accordion-header";
class AccordionBaseState {
    #id;
    #ref;
    disabled;
    #loop;
    orientation;
    rovingFocusGroup;
    constructor(props) {
        this.#id = props.id;
        this.disabled = props.disabled;
        this.#ref = props.ref;
        useRefById({
            id: props.id,
            ref: this.#ref,
        });
        this.orientation = props.orientation;
        this.#loop = props.loop;
        this.rovingFocusGroup = useRovingFocus({
            rootNodeId: this.#id,
            candidateAttr: ACCORDION_TRIGGER_ATTR,
            loop: this.#loop,
            orientation: this.orientation,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        "data-orientation": getDataOrientation(this.orientation.current),
        "data-disabled": getDataDisabled(this.disabled.current),
        [ACCORDION_ROOT_ATTR]: "",
    }));
}
export class AccordionSingleState extends AccordionBaseState {
    #value;
    isMulti = false;
    constructor(props) {
        super(props);
        this.#value = props.value;
    }
    includesItem = (item) => {
        return this.#value.current === item;
    };
    toggleItem = (item) => {
        this.#value.current = this.includesItem(item) ? "" : item;
    };
}
export class AccordionMultiState extends AccordionBaseState {
    #value;
    isMulti = true;
    constructor(props) {
        super(props);
        this.#value = props.value;
    }
    includesItem = (item) => {
        return this.#value.current.includes(item);
    };
    toggleItem = (item) => {
        if (this.includesItem(item)) {
            this.#value.current = this.#value.current.filter((v) => v !== item);
        }
        else {
            this.#value.current = [...this.#value.current, item];
        }
    };
}
export class AccordionItemState {
    #id;
    #ref;
    value;
    disabled;
    root;
    isActive = $derived.by(() => this.root.includesItem(this.value.current));
    isDisabled = $derived.by(() => this.disabled.current || this.root.disabled.current);
    constructor(props) {
        this.value = props.value;
        this.disabled = props.disabled;
        this.root = props.rootState;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.isActive,
        });
    }
    updateValue = () => {
        this.root.toggleItem(this.value.current);
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        "data-state": getDataOpenClosed(this.isActive),
        "data-disabled": getDataDisabled(this.isDisabled),
        "data-orientation": getDataOrientation(this.root.orientation.current),
        [ACCORDION_ITEM_ATTR]: "",
    }));
}
class AccordionTriggerState {
    #ref;
    #disabled;
    #id;
    #root;
    #itemState;
    #isDisabled = $derived.by(() => this.#disabled.current ||
        this.#itemState.disabled.current ||
        this.#root.disabled.current);
    constructor(props, itemState) {
        this.#disabled = props.disabled;
        this.#itemState = itemState;
        this.#root = itemState.root;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: props.id,
            ref: this.#ref,
        });
    }
    #onpointerdown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.pointerType === "touch" || e.button !== 0)
            return e.preventDefault();
        this.#itemState.updateValue();
    };
    #onpointerup = (e) => {
        if (this.#isDisabled)
            return;
        if (e.pointerType === "touch") {
            e.preventDefault();
            this.#itemState.updateValue();
        }
    };
    #onkeydown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            e.preventDefault();
            this.#itemState.updateValue();
            return;
        }
        this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        disabled: this.#isDisabled,
        "aria-expanded": getAriaExpanded(this.#itemState.isActive),
        "aria-disabled": getAriaDisabled(this.#isDisabled),
        "data-disabled": getDataDisabled(this.#isDisabled),
        "data-state": getDataOpenClosed(this.#itemState.isActive),
        "data-orientation": getDataOrientation(this.#root.orientation.current),
        [ACCORDION_TRIGGER_ATTR]: "",
        tabindex: 0,
        //
        onpointerdown: this.#onpointerdown,
        onpointerup: this.#onpointerup,
        onkeydown: this.#onkeydown,
    }));
}
class AccordionContentState {
    item;
    #ref;
    #id;
    #originalStyles = undefined;
    #isMountAnimationPrevented = false;
    #width = $state(0);
    #height = $state(0);
    #forceMount;
    present = $derived.by(() => this.#forceMount.current || this.item.isActive);
    constructor(props, item) {
        this.item = item;
        this.#forceMount = props.forceMount;
        this.#isMountAnimationPrevented = this.item.isActive;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
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
        open: this.item.isActive,
    }));
    props = $derived.by(() => ({
        id: this.#id.current,
        "data-state": getDataOpenClosed(this.item.isActive),
        "data-disabled": getDataDisabled(this.item.isDisabled),
        "data-orientation": getDataOrientation(this.item.root.orientation.current),
        [ACCORDION_CONTENT_ATTR]: "",
        style: {
            "--bits-accordion-content-height": `${this.#height}px`,
            "--bits-accordion-content-width": `${this.#width}px`,
        },
    }));
}
class AccordionHeaderState {
    #id;
    #ref;
    #level;
    #item;
    constructor(props, item) {
        this.#level = props.level;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
        this.#item = item;
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        role: "heading",
        "aria-level": this.#level.current,
        "data-heading-level": this.#level.current,
        "data-state": getDataOpenClosed(this.#item.isActive),
        "data-orientation": getDataOrientation(this.#item.root.orientation.current),
        [ACCORDION_HEADER_ATTR]: "",
    }));
}
const [setAccordionRootContext, getAccordionRootContext] = createContext("Accordion.Root");
const [setAccordionItemContext, getAccordionItemContext] = createContext("Accordion.Item");
export function useAccordionRoot(props) {
    const { type, ...rest } = props;
    const rootState = type === "single"
        ? new AccordionSingleState(rest)
        : new AccordionMultiState(rest);
    return setAccordionRootContext(rootState);
}
export function useAccordionItem(props) {
    const rootState = getAccordionRootContext();
    return setAccordionItemContext(new AccordionItemState({ ...props, rootState }));
}
export function useAccordionTrigger(props) {
    const item = getAccordionItemContext();
    return new AccordionTriggerState(props, item);
}
export function useAccordionContent(props) {
    const item = getAccordionItemContext();
    return new AccordionContentState(props, item);
}
export function useAccordionHeader(props) {
    const item = getAccordionItemContext();
    return new AccordionHeaderState(props, item);
}
