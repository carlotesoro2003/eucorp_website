import { addEventListener } from "../../internal/utils/event.js";
/**
 * Tracks which keys are currently pressed.
 *
 * @see {@link https://runed.dev/docs/utilities/pressed-keys}
 */
export class PressedKeys {
    #pressedKeys = $state([]);
    constructor() {
        $effect(() => {
            const callbacks = [];
            callbacks.push(addEventListener(window, "keydown", (e) => {
                const key = e.key.toLowerCase();
                if (!this.#pressedKeys.includes(key)) {
                    this.#pressedKeys.push(key);
                }
            }));
            callbacks.push(addEventListener(window, "keyup", (e) => {
                const key = e.key.toLowerCase();
                this.#pressedKeys = this.#pressedKeys.filter((k) => k !== key);
            }));
            return () => callbacks.forEach((c) => c());
        });
    }
    has(...keys) {
        const normalizedKeys = keys.map((key) => key.toLowerCase());
        return normalizedKeys.every((key) => this.#pressedKeys.includes(key));
    }
    get all() {
        return this.#pressedKeys;
    }
}
