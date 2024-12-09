import { useRefById } from "svelte-toolbelt";
import { getAriaHidden, getAriaOrientation, getDataOrientation } from "../../internal/attrs.js";
const ROOT_ATTR = "data-separator-root";
class SeparatorRootState {
    #id;
    #ref;
    #orientation;
    #decorative;
    constructor(props) {
        this.#orientation = props.orientation;
        this.#decorative = props.decorative;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        role: this.#decorative.current ? "none" : "separator",
        "aria-orientation": getAriaOrientation(this.#orientation.current),
        "aria-hidden": getAriaHidden(this.#decorative.current),
        "data-orientation": getDataOrientation(this.#orientation.current),
        [ROOT_ATTR]: "",
    }));
}
export function useSeparatorRoot(props) {
    return new SeparatorRootState(props);
}
