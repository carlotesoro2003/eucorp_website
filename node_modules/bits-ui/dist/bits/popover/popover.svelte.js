import { useRefById } from "svelte-toolbelt";
import { kbd } from "../../internal/kbd.js";
import { getAriaExpanded, getDataOpenClosed } from "../../internal/attrs.js";
import { createContext } from "../../internal/create-context.js";
class PopoverRootState {
    open;
    contentNode = $state(null);
    contentId = $state(undefined);
    triggerNode = $state(null);
    constructor(props) {
        this.open = props.open;
    }
    toggleOpen = () => {
        this.open.current = !this.open.current;
    };
    close = () => {
        if (!this.open.current)
            return;
        this.open.current = false;
    };
}
class PopoverTriggerState {
    #id;
    #ref;
    #disabled;
    #root;
    constructor(props, root) {
        this.#id = props.id;
        this.#root = root;
        this.#ref = props.ref;
        this.#disabled = props.disabled;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            onRefChange: (node) => {
                this.#root.triggerNode = node;
            },
        });
    }
    #onpointerdown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.pointerType === "touch" || e.button !== 0)
            return e.preventDefault();
        this.#root.toggleOpen();
    };
    #onpointerup = (e) => {
        if (this.#disabled.current)
            return;
        if (e.pointerType === "touch") {
            e.preventDefault();
            this.#root.toggleOpen();
        }
    };
    #onkeydown = (e) => {
        if (this.#disabled.current)
            return;
        if (!(e.key === kbd.ENTER || e.key === kbd.SPACE))
            return;
        e.preventDefault();
        this.#root.toggleOpen();
    };
    #getAriaControls = () => {
        if (this.#root.open.current && this.#root.contentId) {
            return this.#root.contentId;
        }
        return undefined;
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        "aria-haspopup": "dialog",
        "aria-expanded": getAriaExpanded(this.#root.open.current),
        "data-state": getDataOpenClosed(this.#root.open.current),
        "aria-controls": this.#getAriaControls(),
        "data-popover-trigger": "",
        disabled: this.#disabled.current,
        //
        onpointerdown: this.#onpointerdown,
        onkeydown: this.#onkeydown,
        onpointerup: this.#onpointerup,
    }));
}
class PopoverContentState {
    #id;
    #ref;
    root;
    constructor(props, root) {
        this.#id = props.id;
        this.root = root;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.root.open.current,
            onRefChange: (node) => {
                this.root.contentNode = node;
                this.root.contentId = node?.id;
            },
        });
    }
    snippetProps = $derived.by(() => ({ open: this.root.open.current }));
    props = $derived.by(() => ({
        id: this.#id.current,
        tabindex: -1,
        "data-state": getDataOpenClosed(this.root.open.current),
        "data-popover-content": "",
        style: {
            pointerEvents: "auto",
        },
    }));
}
class PopoverCloseState {
    #id;
    #ref;
    #root;
    constructor(props, root) {
        this.#root = root;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.#root.open.current,
        });
    }
    #onpointerdown = (e) => {
        if (e.pointerType === "touch")
            return e.preventDefault();
        this.#root.close();
    };
    #onpointerup = (e) => {
        e.preventDefault();
        if (e.pointerType === "touch") {
            this.#root.close();
        }
    };
    #onkeydown = (e) => {
        if (!(e.key === kbd.ENTER || e.key === kbd.SPACE))
            return;
        e.preventDefault();
        this.#root.close();
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        onclick: this.#onpointerdown,
        onkeydown: this.#onkeydown,
        type: "button",
        "data-popover-close": "",
    }));
}
//
// CONTEXT METHODS
//
const [setPopoverRootContext, getPopoverRootContext] = createContext("Popover.Root");
export function usePopoverRoot(props) {
    return setPopoverRootContext(new PopoverRootState(props));
}
export function usePopoverTrigger(props) {
    return new PopoverTriggerState(props, getPopoverRootContext());
}
export function usePopoverContent(props) {
    return new PopoverContentState(props, getPopoverRootContext());
}
export function usePopoverClose(props) {
    return new PopoverCloseState(props, getPopoverRootContext());
}
