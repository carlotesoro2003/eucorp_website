import { flushSync } from "svelte";
import { test, vi } from "vitest";
export function testWithEffect(name, fn) {
    test(name, async () => {
        let promise;
        const cleanup = $effect.root(() => {
            promise = fn();
        });
        try {
            await promise;
        }
        finally {
            cleanup();
        }
    });
}
export function vitestSetTimeoutWrapper(fn, timeout) {
    setTimeout(async () => {
        fn();
    }, timeout + 1);
    vi.advanceTimersByTime(timeout);
}
export function focus(node) {
    if (node) {
        flushSync(() => node.focus());
    }
}
