import { extract } from "../extract/extract.svelte.js";
/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://runed.dev/docs/utilities/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 */
export function useMutationObserver(target, callback, options = {}) {
    let observer;
    const targets = $derived.by(() => {
        const value = extract(target);
        return new Set(value ? (Array.isArray(value) ? value : [value]) : []);
    });
    const stop = $effect.root(() => {
        $effect(() => {
            if (!targets.size)
                return;
            observer = new MutationObserver(callback);
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
        takeRecords() {
            return observer?.takeRecords();
        },
    };
}
