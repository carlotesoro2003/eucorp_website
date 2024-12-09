import { extract } from "../extract/extract.svelte.js";
import { addEventListener } from "../../internal/utils/event.js";
export function useEventListener(_target, _events, handler, options) {
    $effect(() => {
        const target = extract(_target);
        const events = extract(_events);
        if (target === undefined || target === null)
            return;
        return addEventListener(target, events, handler, options);
    });
}
