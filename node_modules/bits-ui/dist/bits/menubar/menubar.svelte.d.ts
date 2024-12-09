import { type ReadableBox } from "svelte-toolbelt";
import type { InteractOutsideBehaviorType } from "../utilities/dismissible-layer/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import { type UseRovingFocusReturn } from "../../internal/use-roving-focus.svelte.js";
import type { Direction } from "../../shared/index.js";
import type { WithRefProps } from "../../internal/types.js";
type MenubarRootStateProps = WithRefProps<ReadableBoxedValues<{
    dir: Direction;
    loop: boolean;
}> & WritableBoxedValues<{
    value: string;
}>>;
declare class MenubarRootState {
    id: MenubarRootStateProps["id"];
    ref: MenubarRootStateProps["ref"];
    value: MenubarRootStateProps["value"];
    dir: MenubarRootStateProps["dir"];
    loop: MenubarRootStateProps["loop"];
    rovingFocusGroup: UseRovingFocusReturn;
    currentTabStopId: import("svelte-toolbelt").WritableBox<string | null>;
    wasOpenedByKeyboard: boolean;
    triggerIds: string[];
    valueToContentId: Map<string, ReadableBox<string>>;
    constructor(props: MenubarRootStateProps);
    registerTrigger: (id: string) => void;
    deRegisterTrigger: (id: string) => void;
    getTriggers: () => HTMLButtonElement[];
    onMenuOpen: (id: string) => void;
    onMenuClose: () => void;
    onMenuToggle: (id: string) => void;
    props: {
        readonly id: string;
        readonly role: "menubar";
        readonly "data-menubar-root": "";
    };
}
type MenubarMenuStateProps = ReadableBoxedValues<{
    value: string;
}>;
declare class MenubarMenuState {
    root: MenubarRootState;
    value: MenubarMenuStateProps["value"];
    open: boolean;
    wasOpenedByKeyboard: boolean;
    triggerNode: HTMLElement | null;
    contentNode: HTMLElement | null;
    constructor(props: MenubarMenuStateProps, root: MenubarRootState);
    getTriggerNode: () => HTMLElement | null;
    getContentNode: () => HTMLElement | null;
}
type MenubarTriggerStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
}>>;
declare class MenubarTriggerState {
    #private;
    id: MenubarTriggerStateProps["id"];
    ref: MenubarTriggerStateProps["ref"];
    disabled: MenubarTriggerStateProps["disabled"];
    menu: MenubarMenuState;
    root: MenubarRootState;
    isFocused: boolean;
    constructor(props: MenubarTriggerStateProps, menu: MenubarMenuState);
    props: {
        readonly type: "button";
        readonly role: "menuitem";
        readonly id: string;
        readonly "aria-haspopup": "menu";
        readonly "aria-expanded": "true" | "false";
        readonly "aria-controls": string | undefined;
        readonly "data-highlighted": "" | undefined;
        readonly "data-state": "open" | "closed";
        readonly "data-disabled": "" | undefined;
        readonly "data-menu-value": string;
        readonly disabled: true | undefined;
        readonly tabIndex: number;
        readonly "data-menubar-trigger": "";
        readonly onpointerdown: (e: PointerEvent) => void;
        readonly onpointerenter: () => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onfocus: () => void;
        readonly onblur: () => void;
    };
}
type MenubarContentStateProps = WithRefProps<ReadableBoxedValues<{
    interactOutsideBehavior: InteractOutsideBehaviorType;
}>>;
declare class MenubarContentState {
    #private;
    id: MenubarContentStateProps["id"];
    ref: MenubarContentStateProps["ref"];
    menu: MenubarMenuState;
    root: MenubarRootState;
    hasInteractedOutside: boolean;
    interactOutsideBehavior: MenubarContentStateProps["interactOutsideBehavior"];
    constructor(props: MenubarContentStateProps, menu: MenubarMenuState);
    onCloseAutoFocus: (e: Event) => void;
    onFocusOutside: (e: Event) => void;
    onInteractOutside: () => void;
    onOpenAutoFocus: () => void;
    props: {
        id: string;
        "aria-labelledby": string | undefined;
        style: {
            "--bits-menubar-content-transform-origin": string;
            "--bits-menubar-content-available-width": string;
            "--bits-menubar-content-available-height": string;
            "--bits-menubar-anchor-width": string;
            "--bits-menubar-anchor-height": string;
        };
        onkeydown: (e: KeyboardEvent) => void;
    };
}
export declare function useMenubarRoot(props: MenubarRootStateProps): MenubarRootState;
export declare function useMenubarMenu(props: MenubarMenuStateProps): MenubarMenuState;
export declare function useMenubarTrigger(props: MenubarTriggerStateProps): MenubarTriggerState;
export declare function useMenubarContent(props: MenubarContentStateProps): MenubarContentState;
export {};
