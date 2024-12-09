import { box } from "svelte-toolbelt";
/**
 * Creates a box which will be reset to the default value after some time.
 *
 * @param defaultValue The value which will be set.
 * @param afterMs      A zero-or-greater delay in milliseconds.
 */
export function boxAutoReset(defaultValue, afterMs = 10000) {
    let timeout = null;
    let value = $state(defaultValue);
    function resetAfter() {
        return setTimeout(() => {
            value = defaultValue;
        }, afterMs);
    }
    $effect(() => {
        return () => {
            if (timeout)
                clearTimeout(timeout);
        };
    });
    return box.with(() => value, (v) => {
        value = v;
        if (timeout)
            clearTimeout(timeout);
        timeout = resetAfter();
    });
}
