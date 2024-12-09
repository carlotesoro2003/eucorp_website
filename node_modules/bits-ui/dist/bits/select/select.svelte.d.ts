import { Previous } from "runed";
import type { Box, ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
export declare const INTERACTION_KEYS: string[];
export declare const FIRST_KEYS: string[];
export declare const LAST_KEYS: string[];
export declare const FIRST_LAST_KEYS: string[];
export declare const SELECTION_KEYS: string[];
export declare const CONTENT_MARGIN = 10;
type SelectBaseRootStateProps = ReadableBoxedValues<{
    disabled: boolean;
    required: boolean;
    name: string;
    loop: boolean;
    scrollAlignment: "nearest" | "center";
    items: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    allowDeselect: boolean;
}> & WritableBoxedValues<{
    open: boolean;
}> & {
    isCombobox: boolean;
};
declare class SelectBaseRootState {
    disabled: SelectBaseRootStateProps["disabled"];
    required: SelectBaseRootStateProps["required"];
    name: SelectBaseRootStateProps["name"];
    loop: SelectBaseRootStateProps["loop"];
    open: SelectBaseRootStateProps["open"];
    scrollAlignment: SelectBaseRootStateProps["scrollAlignment"];
    items: SelectBaseRootStateProps["items"];
    allowDeselect: SelectBaseRootStateProps["allowDeselect"];
    touchedInput: boolean;
    inputValue: string;
    inputNode: HTMLElement | null;
    contentNode: HTMLElement | null;
    triggerNode: HTMLElement | null;
    valueId: string;
    highlightedNode: HTMLElement | null;
    highlightedValue: string | null;
    highlightedId: string | undefined;
    highlightedLabel: string | null;
    isUsingKeyboard: boolean;
    isCombobox: boolean;
    bitsAttrs: SelectBitsAttrs;
    triggerPointerDownPos: {
        x: number;
        y: number;
    } | null;
    constructor(props: SelectBaseRootStateProps);
    setHighlightedNode: (node: HTMLElement | null) => void;
    getCandidateNodes: () => HTMLElement[];
    setHighlightedToFirstCandidate: () => void;
    getNodeByValue: (value: string) => HTMLElement | null;
    setOpen: (open: boolean) => void;
    toggleOpen: () => void;
    handleOpen: () => void;
    handleClose: () => void;
    toggleMenu: () => void;
}
type SelectSingleRootStateProps = SelectBaseRootStateProps & WritableBoxedValues<{
    value: string;
}>;
declare class SelectSingleRootState extends SelectBaseRootState {
    value: SelectSingleRootStateProps["value"];
    isMulti: false;
    hasValue: boolean;
    currentLabel: string;
    candidateLabels: string[];
    dataTypeaheadEnabled: boolean;
    constructor(props: SelectSingleRootStateProps);
    includesItem: (itemValue: string) => boolean;
    toggleItem: (itemValue: string, itemLabel?: string) => void;
    setInitialHighlightedNode: () => void;
}
type SelectMultipleRootStateProps = SelectBaseRootStateProps & WritableBoxedValues<{
    value: string[];
}>;
declare class SelectMultipleRootState extends SelectBaseRootState {
    value: SelectMultipleRootStateProps["value"];
    isMulti: true;
    hasValue: boolean;
    constructor(props: SelectMultipleRootStateProps);
    includesItem: (itemValue: string) => boolean;
    toggleItem: (itemValue: string, itemLabel?: string) => void;
    setInitialHighlightedNode: () => void;
}
type SelectRootState = SelectSingleRootState | SelectMultipleRootState;
type SelectInputStateProps = WithRefProps;
declare class SelectInputState {
    #private;
    root: SelectRootState;
    constructor(props: SelectInputStateProps, root: SelectRootState);
    props: {
        readonly [x: string]: string | true | ((e: KeyboardEvent) => Promise<void>) | ((e: Event & {
            currentTarget: HTMLInputElement;
        }) => void) | undefined;
        readonly id: string;
        readonly role: "combobox";
        readonly disabled: true | undefined;
        readonly "aria-activedescendant": string | undefined;
        readonly "aria-autocomplete": "list";
        readonly "aria-expanded": "true" | "false";
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly onkeydown: (e: KeyboardEvent) => Promise<void>;
        readonly oninput: (e: Event & {
            currentTarget: HTMLInputElement;
        }) => void;
    };
}
type SelectComboTriggerStateProps = WithRefProps;
declare class SelectComboTriggerState {
    #private;
    root: SelectBaseRootState;
    constructor(props: SelectComboTriggerStateProps, root: SelectBaseRootState);
    props: {
        readonly [x: string]: string | true | ((e: KeyboardEvent) => void) | ((e: MouseEvent) => void) | undefined;
        readonly id: string;
        readonly disabled: true | undefined;
        readonly "aria-haspopup": "listbox";
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly onpointerdown: (e: MouseEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type SelectTriggerStateProps = WithRefProps;
declare class SelectTriggerState {
    #private;
    root: SelectRootState;
    constructor(props: SelectTriggerStateProps, root: SelectRootState);
    props: {
        readonly [x: string]: string | true | ((e: KeyboardEvent) => void) | ((e: PointerEvent) => void) | undefined;
        readonly id: string;
        readonly disabled: true | undefined;
        readonly "aria-haspopup": "listbox";
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-placeholder": "" | undefined;
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onclick: (e: MouseEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
    };
}
type SelectContentStateProps = WithRefProps;
declare class SelectContentState {
    #private;
    id: SelectContentStateProps["id"];
    ref: SelectContentStateProps["ref"];
    viewportNode: HTMLElement | null;
    root: SelectRootState;
    isPositioned: boolean;
    constructor(props: SelectContentStateProps, root: SelectRootState);
    handleInteractOutside: (e: PointerEvent) => void;
    snippetProps: {
        open: boolean;
    };
    props: {
        readonly [x: string]: string | (() => void) | {
            readonly "--bits-combobox-content-transform-origin": string;
            readonly "--bits-combobox-content-available-width": string;
            readonly "--bits-combobox-content-available-height": string;
            readonly "--bits-combobox-anchor-width": string;
            readonly "--bits-combobox-anchor-height": string;
            readonly "--bits-select-content-transform-origin"?: undefined;
            readonly "--bits-select-content-available-width"?: undefined;
            readonly "--bits-select-content-available-height"?: undefined;
            readonly "--bits-select-anchor-width"?: undefined;
            readonly "--bits-select-anchor-height"?: undefined;
            readonly display: "flex";
            readonly flexDirection: "column";
            readonly outline: "none";
            readonly boxSizing: "border-box";
            readonly pointerEvents: "auto";
        } | {
            readonly "--bits-select-content-transform-origin": string;
            readonly "--bits-select-content-available-width": string;
            readonly "--bits-select-content-available-height": string;
            readonly "--bits-select-anchor-width": string;
            readonly "--bits-select-anchor-height": string;
            readonly "--bits-combobox-content-transform-origin"?: undefined;
            readonly "--bits-combobox-content-available-width"?: undefined;
            readonly "--bits-combobox-content-available-height"?: undefined;
            readonly "--bits-combobox-anchor-width"?: undefined;
            readonly "--bits-combobox-anchor-height"?: undefined;
            readonly display: "flex";
            readonly flexDirection: "column";
            readonly outline: "none";
            readonly boxSizing: "border-box";
            readonly pointerEvents: "auto";
        };
        readonly id: string;
        readonly role: "listbox";
        readonly "data-state": "open" | "closed";
        readonly style: {
            readonly "--bits-combobox-content-transform-origin": string;
            readonly "--bits-combobox-content-available-width": string;
            readonly "--bits-combobox-content-available-height": string;
            readonly "--bits-combobox-anchor-width": string;
            readonly "--bits-combobox-anchor-height": string;
            readonly "--bits-select-content-transform-origin"?: undefined;
            readonly "--bits-select-content-available-width"?: undefined;
            readonly "--bits-select-content-available-height"?: undefined;
            readonly "--bits-select-anchor-width"?: undefined;
            readonly "--bits-select-anchor-height"?: undefined;
            readonly display: "flex";
            readonly flexDirection: "column";
            readonly outline: "none";
            readonly boxSizing: "border-box";
            readonly pointerEvents: "auto";
        } | {
            readonly "--bits-select-content-transform-origin": string;
            readonly "--bits-select-content-available-width": string;
            readonly "--bits-select-content-available-height": string;
            readonly "--bits-select-anchor-width": string;
            readonly "--bits-select-anchor-height": string;
            readonly "--bits-combobox-content-transform-origin"?: undefined;
            readonly "--bits-combobox-content-available-width"?: undefined;
            readonly "--bits-combobox-content-available-height"?: undefined;
            readonly "--bits-combobox-anchor-width"?: undefined;
            readonly "--bits-combobox-anchor-height"?: undefined;
            readonly display: "flex";
            readonly flexDirection: "column";
            readonly outline: "none";
            readonly boxSizing: "border-box";
            readonly pointerEvents: "auto";
        };
        readonly onpointermove: () => void;
    };
}
type SelectItemStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
    disabled: boolean;
    label: string;
    onHighlight: () => void;
    onUnhighlight: () => void;
}>>;
declare class SelectItemState {
    #private;
    root: SelectRootState;
    value: SelectItemStateProps["value"];
    label: SelectItemStateProps["label"];
    onHighlight: SelectItemStateProps["onHighlight"];
    onUnhighlight: SelectItemStateProps["onUnhighlight"];
    disabled: SelectItemStateProps["disabled"];
    isSelected: boolean;
    isHighlighted: boolean;
    prevHighlighted: Previous<boolean>;
    textId: string;
    mounted: boolean;
    constructor(props: SelectItemStateProps, root: SelectRootState);
    snippetProps: {
        selected: boolean;
        highlighted: boolean;
    };
    setTextId: (id: string) => void;
    props: {
        readonly [x: string]: string | ((e: PointerEvent) => void) | undefined;
        readonly id: string;
        readonly role: "option";
        readonly "aria-selected": "true" | undefined;
        readonly "data-value": string;
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly "data-selected": "" | undefined;
        readonly "data-label": string;
        readonly onpointermove: (_: PointerEvent) => void;
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
    };
}
type SelectGroupStateProps = WithRefProps;
declare class SelectGroupState {
    #private;
    root: SelectBaseRootState;
    labelNode: HTMLElement | null;
    constructor(props: SelectGroupStateProps, root: SelectBaseRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly role: "group";
        readonly "aria-labelledby": string | undefined;
    };
}
type SelectGroupHeadingStateProps = WithRefProps;
declare class SelectGroupHeadingState {
    #private;
    group: SelectGroupState;
    constructor(props: SelectGroupHeadingStateProps, group: SelectGroupState);
    props: {
        readonly [x: string]: string;
        readonly id: string;
    };
}
type SelectHiddenInputStateProps = ReadableBoxedValues<{
    value: string;
}>;
declare class SelectHiddenInputState {
    #private;
    root: SelectBaseRootState;
    shouldRender: boolean;
    constructor(props: SelectHiddenInputStateProps, root: SelectBaseRootState);
    props: {
        readonly disabled: true | undefined;
        readonly required: true | undefined;
        readonly name: string;
        readonly value: string;
        readonly style: string;
        readonly tabindex: -1;
        readonly onfocus: (e: FocusEvent) => void;
    };
}
type SelectViewportStateProps = WithRefProps;
declare class SelectViewportState {
    #private;
    root: SelectBaseRootState;
    content: SelectContentState;
    prevScrollTop: number;
    constructor(props: SelectViewportStateProps, content: SelectContentState);
    props: {
        readonly [x: string]: string | {
            readonly position: "relative";
            readonly flex: 1;
            readonly overflow: "auto";
        };
        readonly id: string;
        readonly role: "presentation";
        readonly style: {
            readonly position: "relative";
            readonly flex: 1;
            readonly overflow: "auto";
        };
    };
}
type SelectScrollButtonImplStateProps = WithRefProps<ReadableBoxedValues<{
    mounted: boolean;
}>>;
declare class SelectScrollButtonImplState {
    #private;
    id: SelectScrollButtonImplStateProps["id"];
    ref: SelectScrollButtonImplStateProps["ref"];
    content: SelectContentState;
    root: SelectBaseRootState;
    autoScrollTimer: number | null;
    onAutoScroll: () => void;
    mounted: SelectScrollButtonImplStateProps["mounted"];
    constructor(props: SelectScrollButtonImplStateProps, content: SelectContentState);
    clearAutoScrollTimer: () => void;
    props: {
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
        readonly style: {
            readonly flexShrink: 0;
        };
        readonly onpointerdown: () => void;
        readonly onpointermove: () => void;
        readonly onpointerleave: () => void;
    };
}
declare class SelectScrollDownButtonState {
    state: SelectScrollButtonImplState;
    content: SelectContentState;
    root: SelectBaseRootState;
    canScrollDown: boolean;
    constructor(state: SelectScrollButtonImplState);
    handleAutoScroll: () => void;
    props: {
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
        readonly style: {
            readonly flexShrink: 0;
        };
        readonly onpointerdown: () => void;
        readonly onpointermove: () => void;
        readonly onpointerleave: () => void;
    };
}
declare class SelectScrollUpButtonState {
    state: SelectScrollButtonImplState;
    content: SelectContentState;
    root: SelectBaseRootState;
    canScrollUp: boolean;
    constructor(state: SelectScrollButtonImplState);
    handleAutoScroll: () => void;
    props: {
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
        readonly style: {
            readonly flexShrink: 0;
        };
        readonly onpointerdown: () => void;
        readonly onpointermove: () => void;
        readonly onpointerleave: () => void;
    };
}
type InitSelectProps = {
    type: "single" | "multiple";
    value: Box<string> | Box<string[]>;
} & ReadableBoxedValues<{
    disabled: boolean;
    required: boolean;
    loop: boolean;
    scrollAlignment: "nearest" | "center";
    name: string;
    items: {
        value: string;
        label: string;
        disabled?: boolean;
    }[];
    allowDeselect: boolean;
}> & WritableBoxedValues<{
    open: boolean;
}> & {
    isCombobox: boolean;
};
export declare function useSelectRoot(props: InitSelectProps): SelectRootState;
export declare function useSelectInput(props: SelectInputStateProps): SelectInputState;
export declare function useSelectContent(props: SelectContentStateProps): SelectContentState;
export declare function useSelectTrigger(props: SelectTriggerStateProps): SelectTriggerState;
export declare function useSelectComboTrigger(props: SelectComboTriggerStateProps): SelectComboTriggerState;
export declare function useSelectItem(props: SelectItemStateProps): SelectItemState;
export declare function useSelectViewport(props: SelectViewportStateProps): SelectViewportState;
export declare function useSelectScrollUpButton(props: SelectScrollButtonImplStateProps): SelectScrollUpButtonState;
export declare function useSelectScrollDownButton(props: SelectScrollButtonImplStateProps): SelectScrollDownButtonState;
export declare function useSelectGroup(props: SelectGroupStateProps): SelectGroupState;
export declare function useSelectGroupHeading(props: SelectGroupHeadingStateProps): SelectGroupHeadingState;
export declare function useSelectHiddenInput(props: SelectHiddenInputStateProps): SelectHiddenInputState;
declare const selectParts: readonly ["trigger", "content", "item", "viewport", "scroll-up-button", "scroll-down-button", "group", "group-label", "separator", "arrow", "input", "content-wrapper", "item-text", "value"];
type SelectBitsAttrs = Record<(typeof selectParts)[number], string>;
export declare function getSelectBitsAttrs(root: SelectBaseRootState): SelectBitsAttrs;
export {};
