import { untrack } from "svelte";
import { useRefById } from "svelte-toolbelt";
import { createContext } from "../../internal/create-context.js";
const AVATAR_ROOT_ATTR = "data-avatar-root";
const AVATAR_IMAGE_ATTR = "data-avatar-image";
const AVATAR_FALLBACK_ATTR = "data-avatar-fallback";
class AvatarRootState {
    #id;
    #ref;
    delayMs;
    loadingStatus;
    constructor(props) {
        this.delayMs = props.delayMs;
        this.loadingStatus = props.loadingStatus;
        this.#ref = props.ref;
        this.#id = props.id;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
    }
    loadImage = (src, crossorigin, referrerPolicy) => {
        let imageTimerId;
        const image = new Image();
        image.src = src;
        if (crossorigin !== undefined)
            image.crossOrigin = crossorigin;
        if (referrerPolicy)
            image.referrerPolicy = referrerPolicy;
        this.loadingStatus.current = "loading";
        image.onload = () => {
            imageTimerId = window.setTimeout(() => {
                this.loadingStatus.current = "loaded";
            }, this.delayMs.current);
        };
        image.onerror = () => {
            this.loadingStatus.current = "error";
        };
        return () => {
            window.clearTimeout(imageTimerId);
        };
    };
    props = $derived.by(() => ({
        id: this.#id.current,
        [AVATAR_ROOT_ATTR]: "",
        "data-status": this.loadingStatus.current,
    }));
}
class AvatarImageState {
    #id;
    #ref;
    #crossOrigin;
    #referrerPolicy;
    #src;
    #root;
    constructor(props, root) {
        this.#root = root;
        this.#src = props.src;
        this.#id = props.id;
        this.#ref = props.ref;
        this.#crossOrigin = props.crossOrigin;
        this.#referrerPolicy = props.referrerPolicy;
        useRefById({
            id: this.#id,
            ref: this.#ref,
        });
        $effect.pre(() => {
            if (!this.#src.current) {
                this.#root.loadingStatus.current = "error";
                return;
            }
            // dependency on crossorigin
            this.#crossOrigin.current;
            untrack(() => this.#root.loadImage(this.#src.current ?? "", this.#crossOrigin.current, this.#referrerPolicy.current));
        });
    }
    props = $derived.by(() => ({
        id: this.#id.current,
        style: {
            display: this.#root.loadingStatus.current === "loaded" ? "block" : "none",
        },
        "data-status": this.#root.loadingStatus.current,
        [AVATAR_IMAGE_ATTR]: "",
        src: this.#src.current,
        crossorigin: this.#crossOrigin.current,
        referrerpolicy: this.#referrerPolicy.current,
    }));
}
class AvatarFallbackState {
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
    }
    props = $derived.by(() => ({
        style: {
            display: this.#root.loadingStatus.current === "loaded" ? "none" : undefined,
        },
        "data-status": this.#root.loadingStatus.current,
        [AVATAR_FALLBACK_ATTR]: "",
    }));
}
/**
 * CONTEXT METHODS
 */
const [setAvatarRootContext, getAvatarRootContext] = createContext("Avatar.Root");
export function useAvatarRoot(props) {
    return setAvatarRootContext(new AvatarRootState(props));
}
export function useAvatarImage(props) {
    const root = getAvatarRootContext();
    return new AvatarImageState(props, root);
}
export function useAvatarFallback(props) {
    const root = getAvatarRootContext();
    return new AvatarFallbackState(props, root);
}
