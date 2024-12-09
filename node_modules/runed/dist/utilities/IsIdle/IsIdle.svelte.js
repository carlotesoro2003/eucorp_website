import { extract } from "../extract/index.js";
import { useDebounce } from "../useDebounce/index.js";
import { useEventListener } from "../useEventListener/useEventListener.svelte.js";
const DEFAULT_EVENTS = [
    "keypress",
    "mousemove",
    "touchmove",
    "click",
    "scroll",
];
const DEFAULT_OPTIONS = {
    events: DEFAULT_EVENTS,
    initialState: false,
    timeout: 60000,
};
/**
 * Tracks whether the user is being inactive.
 * @see {@link https://runed.dev/docs/utilities/is-idle}
 */
export class IsIdle {
    current = $state(false);
    #lastActive = $state(Date.now());
    constructor(_options) {
        const options = {
            ...DEFAULT_OPTIONS,
            ..._options,
        };
        const timeout = $derived(extract(options.timeout));
        const events = $derived(extract(options.events));
        const detectVisibilityChanges = $derived(extract(options.detectVisibilityChanges));
        this.current = options.initialState;
        const debouncedReset = useDebounce(() => {
            this.current = true;
        }, () => timeout);
        debouncedReset();
        const handleActivity = () => {
            this.current = false;
            this.#lastActive = Date.now();
            debouncedReset();
        };
        useEventListener(() => window, events, () => {
            handleActivity();
        }, { passive: true });
        $effect(() => {
            if (!detectVisibilityChanges)
                return;
            useEventListener(document, ["visibilitychange"], () => {
                if (document.hidden)
                    return;
                handleActivity();
            });
        });
    }
    get lastActive() {
        return this.#lastActive;
    }
}
