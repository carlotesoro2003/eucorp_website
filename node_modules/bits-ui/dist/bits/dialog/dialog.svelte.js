import { useRefById } from "svelte-toolbelt";
import { getAriaExpanded, getDataOpenClosed } from "../../internal/attrs.js";
import { createContext } from "../../internal/create-context.js";
import { kbd } from "../../internal/kbd.js";
function createAttrs(variant) {
    return {
        content: `data-${variant}-content`,
        trigger: `data-${variant}-trigger`,
        overlay: `data-${variant}-overlay`,
        title: `data-${variant}-title`,
        description: `data-${variant}-description`,
        close: `data-${variant}-close`,
        cancel: `data-${variant}-cancel`,
        action: `data-${variant}-action`,
    };
}
class DialogRootState {
    open;
    variant;
    triggerNode = $state(null);
    titleNode = $state(null);
    contentNode = $state(null);
    descriptionNode = $state(null);
    contentId = $state(undefined);
    titleId = $state(undefined);
    triggerId = $state(undefined);
    descriptionId = $state(undefined);
    cancelNode = $state(null);
    attrs = $derived.by(() => createAttrs(this.variant.current));
    constructor(props) {
        this.open = props.open;
        this.variant = props.variant;
    }
    handleOpen = () => {
        if (this.open.current)
            return;
        this.open.current = true;
    };
    handleClose = () => {
        if (!this.open.current)
            return;
        this.open.current = false;
    };
    sharedProps = $derived.by(() => ({
        "data-state": getDataOpenClosed(this.open.current),
    }));
}
class DialogTriggerState {
    #id;
    #ref;
    #root;
    #disabled;
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
                this.#root.triggerId = node?.id;
            },
        });
    }
    #onclick = (e) => {
        if (this.#disabled.current)
            return;
        if (e.button > 0)
            return;
        this.#root.handleOpen();
    };
    #onpointerdown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.pointerType === "touch")
            return e.preventDefault();
        if (e.button > 0)
            return;
        // by default, it will attempt to focus this trigger on pointerdown
        // since this also opens the dialog we want to prevent that behavior
        e.preventDefault();
        this.#root.handleOpen();
    };
    #onkeydown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            e.preventDefault();
            this.#root.handleOpen();
        }
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        "aria-haspopup": "dialog",
        "aria-expanded": getAriaExpanded(this.#root.open.current),
        "aria-controls": this.#root.contentId,
        [this.#root.attrs.trigger]: "",
        onpointerdown: this.#onpointerdown,
        onkeydown: this.#onkeydown,
        onclick: this.#onclick,
        ...this.#root.sharedProps,
    }));
}
class DialogCloseState {
    #id;
    #ref;
    #root;
    #variant;
    #disabled;
    #attr = $derived.by(() => this.#root.attrs[this.#variant.current]);
    constructor(props, root) {
        this.#root = root;
        this.#ref = props.ref;
        this.#id = props.id;
        this.#variant = props.variant;
        this.#disabled = props.disabled;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.#root.open.current,
        });
    }
    #onclick = (e) => {
        if (this.#disabled.current)
            return;
        if (e.button > 0)
            return;
        this.#root.handleClose();
    };
    #onpointerdown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.pointerType === "touch")
            return e.preventDefault();
        if (e.button > 0)
            return;
        // by default, it will attempt to focus this trigger on pointerdown
        // since this also opens the dialog we want to prevent that behavior
        e.preventDefault();
        this.#root.handleClose();
    };
    #onkeydown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            e.preventDefault();
            this.#root.handleClose();
        }
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        [this.#attr]: "",
        onpointerdown: this.#onpointerdown,
        onclick: this.#onclick,
        onkeydown: this.#onkeydown,
        ...this.#root.sharedProps,
    }));
}
class DialogActionState {
    #id;
    #ref;
    #root;
    #attr = $derived.by(() => this.#root.attrs.action);
    constructor(props, root) {
        this.#id = props.id;
        this.#ref = props.ref;
        this.#root = root;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        [this.#attr]: "",
        ...this.#root.sharedProps,
    }));
}
class DialogTitleState {
    #id;
    #ref;
    #root;
    #level;
    constructor(props, root) {
        this.#id = props.id;
        this.#root = root;
        this.#ref = props.ref;
        this.#level = props.level;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            onRefChange: (node) => {
                this.#root.titleNode = node;
                this.#root.titleId = node?.id;
            },
            deps: () => this.#root.open.current,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        role: "heading",
        "aria-level": this.#level.current,
        [this.#root.attrs.title]: "",
        ...this.#root.sharedProps,
    }));
}
class DialogDescriptionState {
    #id;
    #ref;
    #root;
    constructor(props, root) {
        this.#id = props.id;
        this.#root = root;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.#root.open.current,
            onRefChange: (node) => {
                this.#root.descriptionNode = node;
                this.#root.descriptionId = node?.id;
            },
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        [this.#root.attrs.description]: "",
        ...this.#root.sharedProps,
    }));
}
class DialogContentState {
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
        role: this.root.variant.current === "alert-dialog" ? "alertdialog" : "dialog",
        "aria-describedby": this.root.descriptionId,
        "aria-labelledby": this.root.titleId,
        [this.root.attrs.content]: "",
        style: {
            pointerEvents: "auto",
        },
        ...this.root.sharedProps,
    }));
}
class DialogOverlayState {
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
            deps: () => this.root.open.current,
        });
    }
    snippetProps = $derived.by(() => ({ open: this.root.open.current }));
    props = $derived.by(() => ({
        id: this.#id.current,
        [this.root.attrs.overlay]: "",
        style: {
            pointerEvents: "auto",
        },
        ...this.root.sharedProps,
    }));
}
class AlertDialogCancelState {
    #id;
    #ref;
    #root;
    #disabled;
    constructor(props, root) {
        this.#id = props.id;
        this.#ref = props.ref;
        this.#root = root;
        this.#disabled = props.disabled;
        useRefById({
            id: this.#id,
            ref: this.#ref,
            deps: () => this.#root.open.current,
            onRefChange: (node) => {
                this.#root.cancelNode = node;
            },
        });
    }
    #onclick = (e) => {
        if (this.#disabled.current)
            return;
        if (e.button > 0)
            return;
        this.#root.handleClose();
    };
    #onpointerdown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.pointerType === "touch")
            return e.preventDefault();
        if (e.button > 0)
            return;
        // by default, it will attempt to focus this trigger on pointerdown
        // since this also opens the dialog we want to prevent that behavior
        e.preventDefault();
        this.#root.handleClose();
    };
    #onkeydown = (e) => {
        if (this.#disabled.current)
            return;
        if (e.key === kbd.SPACE || e.key === kbd.ENTER) {
            e.preventDefault();
            this.#root.handleClose();
        }
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        [this.#root.attrs.cancel]: "",
        onpointerdown: this.#onpointerdown,
        onclick: this.#onclick,
        onkeydown: this.#onkeydown,
        ...this.#root.sharedProps,
    }));
}
const [setDialogRootContext, getDialogRootContext] = createContext("Dialog.Root");
export function useDialogRoot(props) {
    return setDialogRootContext(new DialogRootState(props));
}
export function useDialogTrigger(props) {
    const root = getDialogRootContext();
    return new DialogTriggerState(props, root);
}
export function useDialogTitle(props) {
    return new DialogTitleState(props, getDialogRootContext());
}
export function useDialogContent(props) {
    return new DialogContentState(props, getDialogRootContext());
}
export function useDialogOverlay(props) {
    return new DialogOverlayState(props, getDialogRootContext());
}
export function useDialogDescription(props) {
    return new DialogDescriptionState(props, getDialogRootContext());
}
export function useDialogClose(props) {
    return new DialogCloseState(props, getDialogRootContext());
}
export function useAlertDialogCancel(props) {
    return new AlertDialogCancelState(props, getDialogRootContext());
}
export function useAlertDialogAction(props) {
    return new DialogActionState(props, getDialogRootContext());
}
