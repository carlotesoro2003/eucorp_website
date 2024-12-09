import { useRefById } from "svelte-toolbelt";
import { getAriaPressed, getDataDisabled, getDisabled } from "../../internal/attrs.js";
import { kbd } from "../../internal/kbd.js";
const ROOT_ATTR = "data-toggle-root";
class ToggleRootState {
    #id;
    #ref;
    #disabled;
    pressed;
    constructor(props) {
        this.#disabled = props.disabled;
        this.pressed = props.pressed;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    #togglePressed = () => {
        if (!this.#disabled.current) {
            this.pressed.current = !this.pressed.current;
        }
    };
    #onclick = () => {
        if (this.#disabled.current)
            return;
        this.#togglePressed();
    };
    props = $derived.by(() => ({
        [ROOT_ATTR]: "",
        id: this.#id.current,
        "data-disabled": getDataDisabled(this.#disabled.current),
        "aria-pressed": getAriaPressed(this.pressed.current),
        "data-state": getToggleDataState(this.pressed.current),
        disabled: getDisabled(this.#disabled.current),
        onclick: this.#onclick,
    }));
}
//
// METHODS
//
export function useToggleRoot(props) {
    return new ToggleRootState(props);
}
//
// HELPERS
//
export function getToggleDataState(condition) {
    return condition ? "on" : "off";
}
