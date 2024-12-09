import { untrack } from "svelte";
import { afterSleep, box, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { getAriaExpanded, getDataOpenClosed } from "../../internal/attrs.js";
import { addEventListener } from "../../internal/events.js";
import { isElement, isFocusVisible, isTouch } from "../../internal/is.js";
import { getTabbableCandidates } from "../../internal/focus.js";
import { createContext } from "../../internal/create-context.js";
import { useGraceArea } from "../../internal/use-grace-area.svelte.js";
const CONTENT_ATTR = "data-link-preview-content";
const TRIGGER_ATTR = "data-link-preview-trigger";
class LinkPreviewRootState {
    open;
    openDelay;
    closeDelay;
    hasSelection = $state(false);
    isPointerDownOnContent = $state(false);
    containsSelection = $state(false);
    timeout = null;
    contentNode = $state(null);
    contentId = $state(undefined);
    contentMounted = $state(false);
    triggerNode = $state(null);
    isPointerInTransit = box(false);
    isOpening = $state(false);
    constructor(props) {
        this.open = props.open;
        this.openDelay = props.openDelay;
        this.closeDelay = props.closeDelay;
        $effect(() => {
            if (!this.open.current) {
                untrack(() => (this.hasSelection = false));
                return;
            }
            const handlePointerUp = () => {
                this.containsSelection = false;
                this.isPointerDownOnContent = false;
                afterSleep(1, () => {
                    const isSelection = document.getSelection()?.toString() !== "";
                    if (isSelection) {
                        this.hasSelection = true;
                    }
                    else {
                        this.hasSelection = false;
                    }
                });
            };
            const unsubListener = addEventListener(document, "pointerup", handlePointerUp);
            const contentNode = untrack(() => this.contentNode);
            if (!contentNode)
                return;
            const tabCandidates = getTabbableCandidates(contentNode);
            for (const candidate of tabCandidates) {
                candidate.setAttribute("tabindex", "-1");
            }
            return () => {
                unsubListener();
                this.hasSelection = false;
                this.isPointerDownOnContent = false;
            };
        });
    }
    clearTimeout = () => {
        if (this.timeout) {
            window.clearTimeout(this.timeout);
            this.timeout = null;
        }
    };
    handleOpen = () => {
        this.clearTimeout();
        if (this.open.current)
            return;
        this.isOpening = true;
        this.timeout = window.setTimeout(() => {
            if (this.isOpening) {
                this.open.current = true;
                this.isOpening = false;
            }
        }, this.openDelay.current);
    };
    immediateClose = () => {
        this.clearTimeout();
        this.isOpening = false;
        this.open.current = false;
    };
    handleClose = () => {
        this.isOpening = false;
        this.clearTimeout();
        if (!this.isPointerDownOnContent && !this.hasSelection) {
            this.timeout = window.setTimeout(() => {
                this.open.current = false;
            }, this.closeDelay.current);
        }
    };
}
class LinkPreviewTriggerState {
    #id;
    #ref;
    #root;
    constructor(props, root) {
        this.#id = props.id;
        this.#ref = props.ref;
        this.#root = root;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            onRefChange: (node) => {
                this.#root.triggerNode = node;
            },
        });
    }
    #onpointerenter = (e) => {
        if (isTouch(e))
            return;
        this.#root.handleOpen();
    };
    #onpointerleave = (e) => {
        if (isTouch(e))
            return;
        if (!this.#root.contentMounted) {
            this.#root.immediateClose();
        }
    };
    #onfocus = (e) => {
        if (!isFocusVisible(e.currentTarget))
            return;
        this.#root.handleOpen();
    };
    #onblur = () => {
        this.#root.handleClose();
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        "aria-haspopup": "dialog",
        "aria-expanded": getAriaExpanded(this.#root.open.current),
        "data-state": getDataOpenClosed(this.#root.open.current),
        "aria-controls": this.#root.contentId,
        role: "button",
        [TRIGGER_ATTR]: "",
        onpointerenter: this.#onpointerenter,
        onfocus: this.#onfocus,
        onblur: this.#onblur,
        onpointerleave: this.#onpointerleave,
    }));
}
class LinkPreviewContentState {
    #id;
    #ref;
    root;
    constructor(props, root) {
        this.#id = props.id;
        this.#ref = props.ref;
        this.root = root;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            onRefChange: (node) => {
                this.root.contentNode = node;
                this.root.contentId = node?.id;
            },
            deps: () => this.root.open.current,
        });
        $effect(() => {
            if (!this.root.open.current)
                return;
            const { isPointerInTransit, onPointerExit } = useGraceArea(() => this.root.triggerNode, () => this.#ref.current);
            this.root.isPointerInTransit = isPointerInTransit;
            onPointerExit(() => {
                this.root.handleClose();
            });
        });
        onDestroyEffect(() => {
            this.root.clearTimeout();
        });
    }
    #onpointerdown = (e) => {
        const target = e.target;
        if (!isElement(target))
            return;
        if (e.currentTarget.contains(target)) {
            this.root.containsSelection = true;
        }
        this.root.hasSelection = true;
        this.root.isPointerDownOnContent = true;
    };
    #onpointerenter = (e) => {
        if (isTouch(e))
            return;
        this.root.handleOpen();
    };
    #onfocusout = (e) => {
        e.preventDefault();
    };
    snippetProps = $derived.by(() => ({ open: this.root.open.current }));
    props = $derived.by(() => ({
        id: this.#id.current,
        tabindex: -1,
        "data-state": getDataOpenClosed(this.root.open.current),
        [CONTENT_ATTR]: "",
        onpointerdown: this.#onpointerdown,
        onpointerenter: this.#onpointerenter,
        onfocusout: this.#onfocusout,
    }));
}
const [setLinkPreviewRootContext, getLinkPreviewRootContext] = createContext("LinkPreview.Root");
export function useLinkPreviewRoot(props) {
    return setLinkPreviewRootContext(new LinkPreviewRootState(props));
}
export function useLinkPreviewTrigger(props) {
    return new LinkPreviewTriggerState(props, getLinkPreviewRootContext());
}
export function useLinkPreviewContent(props) {
    return new LinkPreviewContentState(props, getLinkPreviewRootContext());
}
