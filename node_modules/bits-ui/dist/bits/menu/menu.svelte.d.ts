import { IsFocusWithin } from "runed";
import { type GraceIntent } from "./utils.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { AnyFn, WithRefProps } from "../../internal/types.js";
import { useRovingFocus } from "../../internal/use-roving-focus.svelte.js";
import type { Direction } from "../../shared/index.js";
export declare const CONTEXT_MENU_TRIGGER_ATTR = "data-context-menu-trigger";
type MenuVariant = "context-menu" | "dropdown-menu" | "menubar";
export type MenuRootStateProps = ReadableBoxedValues<{
    dir: Direction;
    variant: MenuVariant;
}> & {
    onClose: AnyFn;
};
declare class MenuRootState {
    onClose: MenuRootStateProps["onClose"];
    variant: MenuRootStateProps["variant"];
    isUsingKeyboard: import("svelte-toolbelt").WritableBox<boolean>;
    dir: MenuRootStateProps["dir"];
    constructor(props: MenuRootStateProps);
    getAttr: (name: string) => string;
}
type MenuMenuStateProps = WritableBoxedValues<{
    open: boolean;
}>;
declare class MenuMenuState {
    root: MenuRootState;
    open: MenuMenuStateProps["open"];
    contentId: import("svelte-toolbelt").ReadableBox<string>;
    contentNode: HTMLElement | null;
    triggerNode: HTMLElement | null;
    parentMenu?: MenuMenuState;
    constructor(props: MenuMenuStateProps, root: MenuRootState, parentMenu?: MenuMenuState);
    toggleOpen: () => void;
    onOpen: () => void;
    onClose: () => void;
}
type MenuContentStateProps = ReadableBoxedValues<{
    id: string;
    loop: boolean;
    isMounted: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class MenuContentState {
    #private;
    contentRef: MenuContentStateProps["ref"];
    parentMenu: MenuMenuState;
    search: string;
    pointerGraceTimer: number;
    rovingFocusGroup: ReturnType<typeof useRovingFocus>;
    isMounted: MenuContentStateProps["isMounted"];
    isFocusWithin: IsFocusWithin;
    constructor(props: MenuContentStateProps, parentMenu: MenuMenuState);
    getCandidateNodes: () => HTMLElement[];
    isPointerMovingToSubmenu: (e: PointerEvent) => boolean;
    onPointerGraceIntentChange: (intent: GraceIntent | null) => void;
    onItemEnter: (e: PointerEvent) => boolean;
    onItemLeave: (e: PointerEvent) => void;
    onTriggerLeave: (e: PointerEvent) => boolean;
    onOpenAutoFocus: (e: Event) => void;
    handleInteractOutside: (e: PointerEvent) => void;
    snippetProps: {
        open: boolean;
    };
    props: {
        readonly [x: string]: string | ((e: KeyboardEvent) => void) | ((e: PointerEvent) => void) | {
            readonly pointerEvents: "auto";
        };
        readonly id: string;
        readonly role: "menu";
        readonly "aria-orientation": "horizontal" | "vertical";
        readonly "data-state": "open" | "closed";
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onblur: (e: FocusEvent) => void;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onfocus: () => void;
        readonly dir: Direction;
        readonly style: {
            readonly pointerEvents: "auto";
        };
    };
}
type MenuItemSharedStateProps = ReadableBoxedValues<{
    disabled: boolean;
    id: string;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class MenuItemSharedState {
    #private;
    content: MenuContentState;
    ref: MenuItemSharedStateProps["ref"];
    id: MenuItemSharedStateProps["id"];
    disabled: MenuItemSharedStateProps["disabled"];
    constructor(props: MenuItemSharedStateProps, content: MenuContentState);
    props: {
        readonly [x: string]: string | -1 | ((e: PointerEvent) => void) | undefined;
        readonly id: string;
        readonly tabindex: -1;
        readonly role: "menuitem";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => Promise<void>;
        readonly onfocus: (e: FocusEvent) => Promise<void>;
        readonly onblur: (e: FocusEvent) => Promise<void>;
    };
}
type MenuItemStateProps = ReadableBoxedValues<{
    onSelect: AnyFn;
    closeOnSelect: boolean;
}>;
declare class MenuItemState {
    #private;
    root: MenuRootState;
    constructor(props: MenuItemStateProps, item: MenuItemSharedState);
    props: {
        readonly [x: string]: string | -1 | ((e: PointerEvent) => void) | undefined;
        readonly id: string;
        readonly tabindex: -1;
        readonly role: "menuitem";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => Promise<void>;
        readonly onfocus: (e: FocusEvent) => Promise<void>;
        readonly onblur: (e: FocusEvent) => Promise<void>;
    } & {
        onclick: () => void;
        onpointerdown: () => void;
        onpointerup: (e: PointerEvent) => Promise<void>;
        onkeydown: (e: KeyboardEvent) => void;
    } & {
        style?: string;
    };
}
declare class MenuSubTriggerState {
    #private;
    constructor(item: MenuItemSharedState, content: MenuContentState, submenu: MenuMenuState);
    props: {
        readonly [x: string]: string | -1 | ((e: PointerEvent) => void) | undefined;
        readonly id: string;
        readonly tabindex: -1;
        readonly role: "menuitem";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => Promise<void>;
        readonly onfocus: (e: FocusEvent) => Promise<void>;
        readonly onblur: (e: FocusEvent) => Promise<void>;
    } & {
        [x: string]: string | ((e: PointerEvent) => void) | ((e: KeyboardEvent) => void) | undefined;
        "aria-haspopup": string;
        "aria-expanded": "true" | "false";
        "data-state": "open" | "closed";
        "aria-controls": string | undefined;
        onclick: (e: MouseEvent) => void;
        onpointermove: (e: PointerEvent) => void;
        onpointerleave: (e: PointerEvent) => void;
        onkeydown: (e: KeyboardEvent) => void;
    } & {
        style?: string;
    };
}
type MenuCheckboxItemStateProps = WritableBoxedValues<{
    checked: boolean;
    indeterminate: boolean;
}>;
declare class MenuCheckboxItemState {
    #private;
    constructor(props: MenuCheckboxItemStateProps, item: MenuItemState);
    toggleChecked: () => void;
    snippetProps: {
        checked: boolean;
        indeterminate: boolean;
    };
    props: {
        readonly [x: string]: string | -1 | ((e: PointerEvent) => void) | undefined;
        readonly role: "menuitemcheckbox";
        readonly "aria-checked": "true" | "false" | "mixed";
        readonly "data-state": "checked" | "indeterminate" | "unchecked";
        readonly id: string;
        readonly tabindex: -1;
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => Promise<void>;
        readonly onfocus: (e: FocusEvent) => Promise<void>;
        readonly onblur: (e: FocusEvent) => Promise<void>;
        readonly onclick: () => void;
        readonly onpointerdown: () => void;
        readonly onpointerup: (e: PointerEvent) => Promise<void>;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly style?: string;
    };
}
type MenuGroupStateProps = WithRefProps;
declare class MenuGroupState {
    #private;
    groupHeadingId: string | undefined;
    root: MenuRootState;
    constructor(props: MenuGroupStateProps, root: MenuRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly role: "group";
        readonly "aria-labelledby": string | undefined;
    };
}
type MenuGroupHeadingStateProps = WithRefProps;
declare class MenuGroupHeadingState {
    #private;
    constructor(props: MenuGroupHeadingStateProps, group: MenuGroupState | MenuRadioGroupState);
    props: {
        readonly [x: string]: string;
        readonly id: string;
        readonly role: "group";
    };
}
type MenuSeparatorStateProps = WithRefProps;
declare class MenuSeparatorState {
    #private;
    constructor(props: MenuSeparatorStateProps, root: MenuRootState);
    props: {
        readonly [x: string]: string;
        readonly id: string;
        readonly role: "group";
    };
}
declare class MenuArrowState {
    #private;
    constructor(root: MenuRootState);
    props: {
        readonly [x: string]: "";
    };
}
type MenuRadioGroupStateProps = WritableBoxedValues<{
    value: string;
    ref: HTMLElement | null;
}> & ReadableBoxedValues<{
    id: string;
}>;
declare class MenuRadioGroupState {
    #private;
    value: MenuRadioGroupStateProps["value"];
    content: MenuContentState;
    groupHeadingId: string | null;
    root: MenuRootState;
    constructor(props: MenuRadioGroupStateProps, content: MenuContentState);
    setValue: (v: string) => void;
    props: {
        readonly [x: string]: string | null;
        readonly id: string;
        readonly role: "group";
        readonly "aria-labelledby": string | null;
    };
}
type MenuRadioItemStateProps = ReadableBoxedValues<{
    value: string;
    id: string;
    closeOnSelect: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class MenuRadioItemState {
    #private;
    isChecked: boolean;
    constructor(props: MenuRadioItemStateProps, item: MenuItemState, group: MenuRadioGroupState);
    selectValue: () => void;
    props: {
        readonly role: "menuitemradio";
        readonly "aria-checked": "true" | "false" | "mixed";
        readonly "data-state": "checked" | "indeterminate" | "unchecked";
        readonly id: string;
        readonly tabindex: -1;
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointerleave: (e: PointerEvent) => Promise<void>;
        readonly onfocus: (e: FocusEvent) => Promise<void>;
        readonly onblur: (e: FocusEvent) => Promise<void>;
        readonly onclick: () => void;
        readonly onpointerdown: () => void;
        readonly onpointerup: (e: PointerEvent) => Promise<void>;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly style?: string;
    };
}
type DropdownMenuTriggerStateProps = ReadableBoxedValues<{
    id: string;
    disabled: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class DropdownMenuTriggerState {
    #private;
    constructor(props: DropdownMenuTriggerStateProps, parentMenu: MenuMenuState);
    props: {
        readonly [x: string]: string | boolean | ((e: PointerEvent) => void) | ((e: KeyboardEvent) => void) | undefined;
        readonly id: string;
        readonly disabled: boolean;
        readonly "aria-haspopup": "menu";
        readonly "aria-expanded": "true" | "false";
        readonly "aria-controls": string | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "open" | "closed";
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type ContextMenuTriggerStateProps = ReadableBoxedValues<{
    id: string;
    disabled: boolean;
}> & WritableBoxedValues<{
    ref: HTMLElement | null;
}>;
declare class ContextMenuTriggerState {
    #private;
    virtualElement: import("svelte-toolbelt").WritableBox<{
        getBoundingClientRect: () => DOMRect;
    }>;
    constructor(props: ContextMenuTriggerStateProps, parentMenu: MenuMenuState);
    props: {
        readonly id: string;
        readonly disabled: boolean;
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "open" | "closed";
        readonly "data-context-menu-trigger": "";
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointermove: (e: PointerEvent) => void;
        readonly onpointercancel: (e: PointerEvent) => void;
        readonly onpointerup: (e: PointerEvent) => void;
        readonly oncontextmenu: (e: MouseEvent) => void;
    };
}
type MenuItemCombinedProps = MenuItemSharedStateProps & MenuItemStateProps;
export declare function useMenuRoot(props: MenuRootStateProps): MenuRootState;
export declare function useMenuMenu(root: MenuRootState, props: MenuMenuStateProps): MenuMenuState;
export declare function useMenuSubmenu(props: MenuMenuStateProps): MenuMenuState;
export declare function useMenuSubTrigger(props: MenuItemSharedStateProps): MenuSubTriggerState;
export declare function useMenuDropdownTrigger(props: DropdownMenuTriggerStateProps): DropdownMenuTriggerState;
export declare function useMenuContextTrigger(props: ContextMenuTriggerStateProps): ContextMenuTriggerState;
export declare function useMenuContent(props: MenuContentStateProps): MenuContentState;
export declare function useMenuItem(props: MenuItemCombinedProps): MenuItemState;
export declare function useMenuCheckboxItem(props: MenuItemCombinedProps & MenuCheckboxItemStateProps): MenuCheckboxItemState;
export declare function useMenuRadioGroup(props: MenuRadioGroupStateProps): MenuGroupState | MenuRadioGroupState;
export declare function useMenuRadioItem(props: MenuRadioItemStateProps & MenuItemCombinedProps): MenuRadioItemState;
export declare function useMenuGroup(props: MenuGroupStateProps): MenuGroupState | MenuRadioGroupState;
export declare function useMenuGroupHeading(props: MenuGroupHeadingStateProps): MenuGroupHeadingState;
export declare function useMenuSeparator(props: MenuSeparatorStateProps): MenuSeparatorState;
export declare function useMenuArrow(): MenuArrowState;
export {};
