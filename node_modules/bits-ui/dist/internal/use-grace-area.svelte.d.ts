import { type Getter } from "svelte-toolbelt";
export declare function useGraceArea(getTriggerNode: Getter<HTMLElement | null>, getContentNode: Getter<HTMLElement | null>): {
    isPointerInTransit: import("svelte-toolbelt").WritableBox<boolean>;
    onPointerExit: import("./create-event-hook.svelte.js").EventHookOn<void>;
};
