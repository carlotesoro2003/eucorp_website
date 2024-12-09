import { box } from "svelte-toolbelt";
import { useId } from "../../../internal/use-id.js";
const focusStack = box([]);
export function createFocusScopeStack() {
    const stack = focusStack;
    return {
        add(focusScope) {
            // pause the currently active focus scope (top of the stack)
            const activeFocusScope = stack.current[0];
            if (focusScope.id !== activeFocusScope?.id) {
                activeFocusScope?.pause();
            }
            // remove in case it already exists because it'll be added to the top
            stack.current = removeFromFocusScopeArray(stack.current, focusScope);
            stack.current.unshift(focusScope);
        },
        remove(focusScope) {
            stack.current = removeFromFocusScopeArray(stack.current, focusScope);
            stack.current[0]?.resume();
        },
    };
}
export function createFocusScopeAPI() {
    let paused = $state(false);
    return {
        id: useId(),
        get paused() {
            return paused;
        },
        pause() {
            paused = true;
        },
        resume() {
            paused = false;
        },
    };
}
function removeFromFocusScopeArray(arr, item) {
    return [...arr].filter((i) => i.id !== item.id);
}
export function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
}
