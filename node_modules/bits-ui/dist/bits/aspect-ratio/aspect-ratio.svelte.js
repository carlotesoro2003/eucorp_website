import { useRefById } from "svelte-toolbelt";
const ASPECT_RATIO_ROOT_ATTR = "data-aspect-ratio-root";
export class AspectRatioRootState {
    #ref;
    #id;
    #ratio;
    constructor(props) {
        this.#ref = props.ref;
        this.#id = props.id;
        this.#ratio = props.ratio;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    wrapperProps = $derived.by(() => ({
        style: {
            position: "relative",
            width: "100%",
            paddingBottom: `${this.#ratio.current ? 100 / this.#ratio.current : 0}%}`,
        },
    }));
    props = $derived.by(() => ({
        id: this.#id.current,
        style: {
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        [ASPECT_RATIO_ROOT_ATTR]: "",
    }));
}
export function useAspectRatioRoot(props) {
    return new AspectRatioRootState(props);
}
