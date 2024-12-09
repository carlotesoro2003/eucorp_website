import { type ReadableBox, type WritableBox } from "svelte-toolbelt";
import type { Orientation } from "../shared/index.js";
type UseRovingFocusProps = {
    /**
     * The selector used to find the focusable candidates.
     */
    candidateAttr: string;
    /**
     * Custom candidate selector
     */
    candidateSelector?: string;
    /**
     * The id of the root node
     */
    rootNodeId: ReadableBox<string>;
    /**
     * Whether to loop through the candidates when reaching the end.
     */
    loop: ReadableBox<boolean>;
    /**
     * The orientation of the roving focus group. Used
     * to determine how keyboard navigation should work.
     */
    orientation: ReadableBox<Orientation>;
    /**
     * A callback function called when a candidate is focused.
     */
    onCandidateFocus?: (node: HTMLElement) => void;
    /**
     * The current tab stop id.
     */
    currentTabStopId?: WritableBox<string | null>;
};
export type UseRovingFocusReturn = ReturnType<typeof useRovingFocus>;
export declare function useRovingFocus(props: UseRovingFocusProps): {
    setCurrentTabStopId(id: string): void;
    getTabIndex: (node: HTMLElement | null | undefined) => 0 | -1;
    handleKeydown: (node: HTMLElement | null | undefined, e: KeyboardEvent, both?: boolean) => HTMLElement | undefined;
    focusFirstCandidate: () => void;
    currentTabStopId: WritableBox<string | null>;
};
export {};
