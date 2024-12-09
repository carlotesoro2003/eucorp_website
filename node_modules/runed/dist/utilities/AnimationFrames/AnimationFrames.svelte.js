import { untrack } from "svelte";
import { extract } from "../extract/index.js";
/**
 * Wrapper over {@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame requestAnimationFrame},
 * with controls for pausing and resuming the animation, reactive tracking and optional limiting of fps, and utilities.
 */
export class AnimationFrames {
    #callback;
    #fpsLimitOption = 0;
    #fpsLimit = $derived(extract(this.#fpsLimitOption) ?? 0);
    #previousTimestamp = null;
    #frame = null;
    #fps = $state(0);
    #running = $state(false);
    constructor(callback, options = {}) {
        this.#fpsLimitOption = options.fpsLimit;
        this.#callback = callback;
        $effect(() => {
            if (options.immediate ?? true) {
                untrack(this.start);
            }
            return this.stop;
        });
    }
    #loop = (timestamp) => {
        if (!this.#running)
            return;
        if (this.#previousTimestamp === null) {
            this.#previousTimestamp = timestamp;
        }
        const delta = timestamp - this.#previousTimestamp;
        const fps = 1000 / delta;
        if (this.#fpsLimit && fps > this.#fpsLimit) {
            this.#frame = requestAnimationFrame(this.#loop);
            return;
        }
        this.#fps = fps;
        this.#previousTimestamp = timestamp;
        this.#callback({ delta, timestamp });
        this.#frame = requestAnimationFrame(this.#loop);
    };
    start = () => {
        this.#running = true;
        this.#previousTimestamp = 0;
        this.#frame = requestAnimationFrame(this.#loop);
    };
    stop = () => {
        if (!this.#frame)
            return;
        this.#running = false;
        cancelAnimationFrame(this.#frame);
        this.#frame = null;
    };
    toggle = () => {
        this.#running ? this.stop() : this.start();
    };
    get fps() {
        return !this.#running ? 0 : this.#fps;
    }
    get running() {
        return this.#running;
    }
}
