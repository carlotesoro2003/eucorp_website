import { srOnlyStyles, styleToString, useRefById } from "svelte-toolbelt";
import { getAriaChecked, getAriaRequired, getDataDisabled } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
import { createContext } from "../../internal/create-context.js";
const CHECKBOX_ROOT_ATTR = "data-checkbox-root";
class CheckboxRootState {
    #id;
    #ref;
    #type;
    checked;
    disabled;
    required;
    name;
    value;
    indeterminate;
    constructor(props) {
        this.checked = props.checked;
        this.disabled = props.disabled;
        this.required = props.required;
        this.name = props.name;
        this.value = props.value;
        this.#ref = props.ref;
        this.#id = props.id;
        this.indeterminate = props.indeterminate;
        this.#type = props.type;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    #onkeydown = (e) => {
        if (this.disabled.current)
            return;
        if (e.key === kbd.ENTER)
            e.preventDefault();
        if (e.key === kbd.SPACE) {
            e.preventDefault();
            this.#toggle();
        }
    };
    #toggle = () => {
        if (this.indeterminate.current) {
            this.indeterminate.current = false;
            this.checked.current = true;
        }
        else {
            this.checked.current = !this.checked.current;
        }
    };
    #onclick = () => {
        if (this.disabled.current)
            return;
        this.#toggle();
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        role: "checkbox",
        type: this.#type.current,
        disabled: this.disabled.current,
        "aria-checked": getAriaChecked(this.checked.current, this.indeterminate.current),
        "aria-required": getAriaRequired(this.required.current),
        "data-disabled": getDataDisabled(this.disabled.current),
        "data-state": getCheckboxDataState(this.checked.current, this.indeterminate.current),
        [CHECKBOX_ROOT_ATTR]: "",
        //
        onclick: this.#onclick,
        onkeydown: this.#onkeydown,
    }));
}
//
// INPUT
//
class CheckboxInputState {
    root;
    shouldRender = $derived.by(() => Boolean(this.root.name.current));
    constructor(root) {
        this.root = root;
    }
    props = $derived.by(() => ({
        type: "checkbox",
        checked: this.root.checked.current === true,
        disabled: this.root.disabled.current,
        required: this.root.required.current,
        name: this.root.name.current,
        value: this.root.value.current,
        "aria-hidden": "true",
        style: styleToString(srOnlyStyles),
    }));
}
//
// HELPERS
//
function getCheckboxDataState(checked, indeterminate) {
    if (indeterminate) {
        return "indeterminate";
    }
    return checked ? "checked" : "unchecked";
}
//
// CONTEXT METHODS
//
const [setCheckboxRootContext, getCheckboxRootContext] = createContext("Checkbox.Root");
export function useCheckboxRoot(props) {
    return setCheckboxRootContext(new CheckboxRootState(props));
}
export function useCheckboxInput() {
    const root = getCheckboxRootContext();
    return new CheckboxInputState(root);
}
