import { useRefById } from "svelte-toolbelt";
const ROOT_ATTR = "data-progress-root";
class ProgressRootState {
    #id;
    #ref;
    #value;
    #max;
    constructor(props) {
        this.#value = props.value;
        this.#max = props.max;
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    props = $derived.by(() => ({
        role: "meter",
        value: this.#value.current,
        max: this.#max.current,
        "aria-valuemin": 0,
        "aria-valuemax": this.#max.current,
        "aria-valuenow": this.#value.current,
        "data-value": this.#value.current,
        "data-state": getProgressDataState(this.#value.current, this.#max.current),
        "data-max": this.#max.current,
        [ROOT_ATTR]: "",
    }));
}
//
// HELPERS
//
function getProgressDataState(value, max) {
    if (value === null)
        return "indeterminate";
    return value === max ? "loaded" : "loading";
}
//
// STATE PROVIDERS
//
export function useProgressRootState(props) {
    return new ProgressRootState(props);
}
