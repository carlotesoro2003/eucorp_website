import { extract } from "../extract/extract.svelte.js";
/**
 * Reports changes to the dimensions of an Element's content or the border-box
 *
 * @see https://runed.dev/docs/utilities/useResizeObserver
 */
export function useResizeObserver(target, callback, options = {}) {
    let observer;
    const targets = $derived.by(() => {
        const value = extract(target);
        return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
    });
    const stop = $effect.root(() => {
        $effect(() => {
            if (!targets.size)
                return;
            observer = new ResizeObserver(callback);
            for (const el of targets)
                observer.observe(el, options);
            return () => {
                observer?.disconnect();
                observer = undefined;
            };
        });
    });
    $effect(() => {
        return stop;
    });
    return {
        stop,
    };
}
