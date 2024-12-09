import { get } from "svelte/store";
function isWritable(t) {
    return "set" in t;
}
export class Store {
    #current = $state();
    #store;
    constructor(store) {
        this.#current = get(store);
        $effect.pre(() => {
            return store.subscribe((v) => {
                this.#current = v;
            });
        });
        this.#store = store;
    }
    get current() {
        return this.#current;
    }
    /**
     * In case the expected type to set is never, this means that the store is not `writable`.
     */
    set current(v) {
        if (isWritable(this.#store)) {
            this.#store.set(v);
        }
        else {
            throw new Error("Tried setting a readable store");
        }
    }
}
