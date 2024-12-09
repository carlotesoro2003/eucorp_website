import { type WritableBox } from "svelte-toolbelt";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import { type UseRovingFocusReturn } from "../../internal/use-roving-focus.svelte.js";
import type { Orientation } from "../../shared/index.js";
import type { WithRefProps } from "../../internal/types.js";
type ToolbarRootStateProps = WithRefProps<ReadableBoxedValues<{
    orientation: Orientation;
    loop: boolean;
}>>;
declare class ToolbarRootState {
    #private;
    orientation: ToolbarRootStateProps["orientation"];
    rovingFocusGroup: UseRovingFocusReturn;
    constructor(props: ToolbarRootStateProps);
    props: {
        readonly id: string;
        readonly role: "toolbar";
        readonly "data-orientation": Orientation;
        readonly "data-toolbar-root": "";
    };
}
type ToolbarGroupBaseStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
}>>;
declare class ToolbarGroupBaseState {
    id: ToolbarGroupBaseStateProps["id"];
    ref: ToolbarGroupBaseStateProps["ref"];
    disabled: ToolbarGroupBaseStateProps["disabled"];
    root: ToolbarRootState;
    constructor(props: ToolbarGroupBaseStateProps, root: ToolbarRootState);
    props: {
        readonly id: string;
        readonly "data-toolbar-group": "";
        readonly role: "group";
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-disabled": "" | undefined;
    };
}
type ToolbarGroupSingleStateProps = ToolbarGroupBaseStateProps & WritableBoxedValues<{
    value: string;
}>;
declare class ToolbarGroupSingleState extends ToolbarGroupBaseState {
    #private;
    isMulti: boolean;
    anyPressed: boolean;
    constructor(props: ToolbarGroupSingleStateProps, root: ToolbarRootState);
    includesItem: (item: string) => boolean;
    toggleItem: (item: string) => void;
    createItem(props: ToolbarGroupItemStateProps): ToolbarGroupItemState;
}
type ToolbarGroupMultipleStateProps = ToolbarGroupBaseStateProps & WritableBoxedValues<{
    value: string[];
}>;
declare class ToolbarGroupMultipleState extends ToolbarGroupBaseState {
    #private;
    isMulti: boolean;
    anyPressed: boolean;
    constructor(props: ToolbarGroupMultipleStateProps, root: ToolbarRootState);
    includesItem: (item: string) => boolean;
    toggleItem: (item: string) => void;
}
type ToolbarGroupState = ToolbarGroupSingleState | ToolbarGroupMultipleState;
type ToolbarGroupItemStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
    disabled: boolean;
}>>;
declare class ToolbarGroupItemState {
    #private;
    constructor(props: ToolbarGroupItemStateProps, group: ToolbarGroupState, root: ToolbarRootState);
    toggleItem: () => void;
    isPressed: boolean;
    props: {
        readonly id: string;
        readonly role: "radio" | undefined;
        readonly tabindex: number;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "off" | "on";
        readonly "data-value": string;
        readonly "aria-pressed": "true" | "false" | undefined;
        readonly "aria-checked": "true" | "false" | "mixed" | undefined;
        readonly "data-toolbar-item": "";
        readonly "data-toolbar-group-item": "";
        readonly disabled: true | undefined;
        readonly onclick: () => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type ToolbarLinkStateProps = WithRefProps;
declare class ToolbarLinkState {
    #private;
    constructor(props: ToolbarLinkStateProps, root: ToolbarRootState);
    props: {
        id: string;
        "data-toolbar-link": string;
        "data-toolbar-item": string;
        role: "link" | undefined;
        tabindex: number;
        "data-orientation": "horizontal" | "vertical";
        onkeydown: (e: KeyboardEvent) => void;
    };
}
type ToolbarButtonStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
}>>;
declare class ToolbarButtonState {
    #private;
    constructor(props: ToolbarButtonStateProps, root: ToolbarRootState);
    props: {
        readonly id: string;
        readonly "data-toolbar-item": "";
        readonly "data-toolbar-button": "";
        readonly role: "button" | undefined;
        readonly tabindex: number;
        readonly "data-disabled": "" | undefined;
        readonly "data-orientation": "horizontal" | "vertical";
        readonly disabled: true | undefined;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
export declare function useToolbarRoot(props: ToolbarRootStateProps): ToolbarRootState;
type InitToolbarGroupProps = WithRefProps<{
    type: "single" | "multiple";
    value: WritableBox<string> | WritableBox<string[]>;
} & ReadableBoxedValues<{
    disabled: boolean;
}>>;
export declare function useToolbarGroup(props: InitToolbarGroupProps): ToolbarGroupState;
export declare function useToolbarGroupItem(props: ToolbarGroupItemStateProps): ToolbarGroupItemState;
export declare function useToolbarButton(props: ToolbarButtonStateProps): ToolbarButtonState;
export declare function useToolbarLink(props: ToolbarLinkStateProps): ToolbarLinkState;
export {};
