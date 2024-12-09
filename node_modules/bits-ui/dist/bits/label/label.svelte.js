import { useRefById } from "svelte-toolbelt";
const ROOT_ATTR = "data-label-root";
class LabelRootState {
    #id;
    #ref;
    constructor(props) {
        this.#id = props.id;
        this.#ref = props.ref;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    #onmousedown = (e) => {
        if (e.detail > 1)
            e.preventDefault();
    };
    props = $derived({
        [ROOT_ATTR]: "",
        onmousedown: this.#onmousedown,
    });
}
export function setLabelRootState(props) {
    return new LabelRootState(props);
}
