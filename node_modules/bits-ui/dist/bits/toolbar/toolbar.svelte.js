import { useRefById } from "svelte-toolbelt";
import { getAriaChecked, getAriaPressed, getDataDisabled, getDataOrientation, getDisabled, } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
import { useRovingFocus, } from "../../internal/use-roving-focus.svelte.js";
import { createContext } from "../../internal/create-context.js";
const ROOT_ATTR = "data-toolbar-root";
// all links, buttons, and items must have the ITEM_ATTR for roving focus
const ITEM_ATTR = "data-toolbar-item";
const GROUP_ATTR = "data-toolbar-group";
const GROUP_ITEM_ATTR = "data-toolbar-group-item";
const LINK_ATTR = "data-toolbar-link";
const BUTTON_ATTR = "data-toolbar-button";
class ToolbarRootState {
    #id;
    #ref;
    orientation;
    #loop;
    rovingFocusGroup;
    constructor(props) {
        this.#id = props.id;
        this.orientation = props.orientation;
        this.#loop = props.loop;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
        this.rovingFocusGroup = useRovingFocus({
            orientation: this.orientation,
            loop: this.#loop,
            rootNodeId: this.#id,
            candidateAttr: ITEM_ATTR,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        role: "toolbar",
        "data-orientation": this.orientation.current,
        [ROOT_ATTR]: "",
    }));
}
class ToolbarGroupBaseState {
    id;
    ref;
    disabled;
    root;
    constructor(props, root) {
        this.id = props.id;
        this.ref = props.ref;
        this.disabled = props.disabled;
        this.root = root;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        [GROUP_ATTR]: "",
        role: "group",
        "data-orientation": getDataOrientation(this.root.orientation.current),
        "data-disabled": getDataDisabled(this.disabled.current),
    }));
}
class ToolbarGroupSingleState extends ToolbarGroupBaseState {
    #value;
    isMulti = false;
    anyPressed = $derived.by(() => this.#value.current !== "");
    constructor(props, root) {
        super(props, root);
        this.#value = props.value;
    }
    includesItem = (item) => {
        return this.#value.current === item;
    };
    toggleItem = (item) => {
        if (this.includesItem(item)) {
            this.#value.current = "";
        }
        else {
            this.#value.current = item;
        }
    };
    createItem(props) {
        return new ToolbarGroupItemState(props, this, this.root);
    }
}
class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
    #value;
    isMulti = true;
    anyPressed = $derived.by(() => this.#value.current.length > 0);
    constructor(props, root) {
        super(props, root);
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
class ToolbarGroupItemState {
    #id;
    #ref;
    #group;
    #root;
    #value;
    #disabled;
    #isDisabled = $derived.by(() => this.#disabled.current || this.#group.disabled.current);
    constructor(props, group, root) {
        this.#value = props.value;
        this.#disabled = props.disabled;
        this.#group = group;
        this.#root = root;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
        $effect(() => {
            this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
        });
    }
    toggleItem = () => {
        if (this.#isDisabled)
            return;
        this.#group.toggleItem(this.#value.current);
    };
    #onclick = () => {
        if (this.#isDisabled)
            return;
        this.toggleItem();
    };
    #onkeydown = (e) => {
        if (this.#isDisabled)
            return;
        if (e.key === kbd.ENTER || e.key === kbd.SPACE) {
            e.preventDefault();
            this.toggleItem();
            return;
        }
        this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
    };
    isPressed = $derived.by(() => this.#group.includesItem(this.#value.current));
    #ariaChecked = $derived.by(() => {
        return this.#group.isMulti ? undefined : getAriaChecked(this.isPressed, false);
    });
    #ariaPressed = $derived.by(() => {
        return this.#group.isMulti ? getAriaPressed(this.isPressed) : undefined;
    });
    #tabIndex = $state(0);
    props = $derived.by(() => ({
        id: this.#id.current,
        role: this.#group.isMulti ? undefined : "radio",
        tabindex: this.#tabIndex,
        "data-orientation": getDataOrientation(this.#root.orientation.current),
        "data-disabled": getDataDisabled(this.#isDisabled),
        "data-state": getToggleItemDataState(this.isPressed),
        "data-value": this.#value.current,
        "aria-pressed": this.#ariaPressed,
        "aria-checked": this.#ariaChecked,
        [ITEM_ATTR]: "",
        [GROUP_ITEM_ATTR]: "",
        disabled: getDisabled(this.#isDisabled),
        //
        onclick: this.#onclick,
        onkeydown: this.#onkeydown,
    }));
}
class ToolbarLinkState {
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
        });
        $effect(() => {
            this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
        });
    }
    #onkeydown = (e) => {
        this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
    };
    #role = $derived.by(() => {
        if (!this.#ref.current)
            return undefined;
        const tagName = this.#ref.current.tagName;
        if (tagName !== "A")
            return "link";
        return undefined;
    });
    #tabIndex = $state(0);
    props = $derived.by(() => ({
        id: this.#id.current,
        [LINK_ATTR]: "",
        [ITEM_ATTR]: "",
        role: this.#role,
        tabindex: this.#tabIndex,
        "data-orientation": getDataOrientation(this.#root.orientation.current),
        //
        onkeydown: this.#onkeydown,
    }));
}
class ToolbarButtonState {
    #id;
    #ref;
    #root;
    #disabled;
    constructor(props, root) {
        this.#id = props.id;
        this.#ref = props.ref;
        this.#disabled = props.disabled;
        this.#root = root;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
        $effect(() => {
            this.#tabIndex = this.#root.rovingFocusGroup.getTabIndex(this.#ref.current);
        });
    }
    #onkeydown = (e) => {
        this.#root.rovingFocusGroup.handleKeydown(this.#ref.current, e);
    };
    #tabIndex = $state(0);
    #role = $derived.by(() => {
        if (!this.#ref.current)
            return undefined;
        const tagName = this.#ref.current.tagName;
        if (tagName !== "BUTTON")
            return "button";
        return undefined;
    });
    props = $derived.by(() => ({
        id: this.#id.current,
        [ITEM_ATTR]: "",
        [BUTTON_ATTR]: "",
        role: this.#role,
        tabindex: this.#tabIndex,
        "data-disabled": getDataDisabled(this.#disabled.current),
        "data-orientation": getDataOrientation(this.#root.orientation.current),
        disabled: getDisabled(this.#disabled.current),
        //
        onkeydown: this.#onkeydown,
    }));
}
//
// HELPERS
//
function getToggleItemDataState(condition) {
    return condition ? "on" : "off";
}
//
// CONTEXT METHODS
//
const [setToolbarRootContext, getToolbarRootContext] = createContext("Toolbar.Root");
const [setToolbarGroupContext, getToolbarGroupContext] = createContext("Toolbar.Group");
export function useToolbarRoot(props) {
    return setToolbarRootContext(new ToolbarRootState(props));
}
export function useToolbarGroup(props) {
    const { type, ...rest } = props;
    const rootState = getToolbarRootContext();
    const groupState = type === "single"
        ? new ToolbarGroupSingleState(rest, rootState)
        : new ToolbarGroupMultipleState(rest, rootState);
    return setToolbarGroupContext(groupState);
}
export function useToolbarGroupItem(props) {
    const group = getToolbarGroupContext();
    return new ToolbarGroupItemState(props, group, group.root);
}
export function useToolbarButton(props) {
    return new ToolbarButtonState(props, getToolbarRootContext());
}
export function useToolbarLink(props) {
    return new ToolbarLinkState(props, getToolbarRootContext());
}
