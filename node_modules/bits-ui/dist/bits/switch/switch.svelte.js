import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import { getAriaChecked, getAriaHidden, getAriaRequired, getDataChecked, getDataDisabled, getDataRequired, getDisabled, } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
import { createContext } from "../../internal/create-context.js";
const ROOT_ATTR = "data-switch-root";
const THUMB_ATTR = "data-switch-thumb";
class SwitchRootState {
    #id;
    #ref;
    checked;
    disabled;
    required;
    name;
    value;
    constructor(props) {
        this.checked = props.checked;
        this.disabled = props.disabled;
        this.required = props.required;
        this.name = props.name;
        this.value = props.value;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    #toggle = () => {
        this.checked.current = !this.checked.current;
    };
    #onkeydown = (e) => {
        if (!(e.key === kbd.ENTER || e.key === kbd.SPACE) || this.disabled.current)
            return;
        e.preventDefault();
        this.#toggle();
    };
    #onclick = (e) => {
        if (this.disabled.current)
            return;
        this.#toggle();
    };
    sharedProps = $derived.by(() => ({
        "data-disabled": getDataDisabled(this.disabled.current),
        "data-state": getDataChecked(this.checked.current),
        "data-required": getDataRequired(this.required.current),
    }));
    props = $derived.by(() => ({
        ...this.sharedProps,
        id: this.#id.current,
        role: "switch",
        disabled: getDisabled(this.disabled.current),
        "aria-checked": getAriaChecked(this.checked.current, false),
        "aria-required": getAriaRequired(this.required.current),
        [ROOT_ATTR]: "",
        //
        onclick: this.#onclick,
        onkeydown: this.#onkeydown,
    }));
}
class SwitchInputState {
    #root;
    shouldRender = $derived.by(() => this.#root.name.current !== undefined);
    constructor(root) {
        this.#root = root;
    }
    props = $derived.by(() => ({
        type: "checkbox",
        name: this.#root.name.current,
        value: this.#root.value.current,
        checked: this.#root.checked.current,
        disabled: this.#root.disabled.current,
        required: this.#root.required.current,
        "aria-hidden": getAriaHidden(true),
        style: styleToString(srOnlyStyles),
    }));
}
class SwitchThumbState {
    #id;
    #ref;
    root;
    constructor(props, root) {
        this.root = root;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    props = $derived.by(() => ({
        ...this.root.sharedProps,
        id: this.#id.current,
        [THUMB_ATTR]: "",
    }));
}
//
// CONTEXT METHODS
//
const [setSwitchRootContext, getSwitchRootContext] = createContext("Switch.Root");
export function useSwitchRoot(props) {
    return setSwitchRootContext(new SwitchRootState(props));
}
export function useSwitchInput() {
    return new SwitchInputState(getSwitchRootContext());
}
export function useSwitchThumb(props) {
    return new SwitchThumbState(props, getSwitchRootContext());
}
