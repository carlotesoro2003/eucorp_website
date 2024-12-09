import type { CommandState } from "./types.js";
import type { WithRefProps } from "../../internal/types.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
export declare function defaultFilter(value: string, search: string, keywords?: string[]): number;
export declare const setCommandGroupContainerContext: (value: CommandGroupContainerState) => CommandGroupContainerState, getCommandGroupContainerContext: <T extends CommandGroupContainerState | null | undefined = CommandGroupContainerState>(fallback?: T | undefined) => T extends null ? CommandGroupContainerState | null : CommandGroupContainerState;
type CommandRootStateProps = WithRefProps<ReadableBoxedValues<{
    filter: (value: string, search: string, keywords?: string[]) => number;
    shouldFilter: boolean;
    loop: boolean;
    vimBindings: boolean;
    disablePointerSelection: boolean;
}> & WritableBoxedValues<{
    value: string;
}>>;
type SetState = <K extends keyof CommandState>(key: K, value: CommandState[K], opts?: any) => void;
declare class CommandRootState {
    #private;
    allItems: Set<string>;
    allGroups: Map<string, Set<string>>;
    allIds: Map<string, {
        value: string;
        keywords?: string[];
    }>;
    id: CommandRootStateProps["id"];
    ref: CommandRootStateProps["ref"];
    filter: CommandRootStateProps["filter"];
    shouldFilter: CommandRootStateProps["shouldFilter"];
    loop: CommandRootStateProps["loop"];
    key: number;
    viewportNode: HTMLElement | null;
    inputNode: HTMLElement | null;
    labelNode: HTMLElement | null;
    valueProp: CommandRootStateProps["value"];
    disablePointerSelection: CommandRootStateProps["disablePointerSelection"];
    commandState: CommandState;
    _commandState: CommandState;
    snapshot: () => CommandState;
    setState: SetState;
    emit: () => void;
    constructor(props: CommandRootStateProps);
    setValue: (value: string, opts?: boolean) => void;
    registerValue: (id: string, value: string, keywords?: string[]) => (() => void) | undefined;
    registerItem: (id: string, groupId: string | undefined) => () => void;
    registerGroup: (id: string) => () => void;
    props: {
        readonly id: string;
        readonly role: "application";
        readonly "data-command-root": "";
        readonly tabindex: -1;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
type CommandEmptyStateProps = WithRefProps & ReadableBoxedValues<{
    forceMount: boolean;
}>;
declare class CommandEmptyState {
    #private;
    shouldRender: boolean;
    constructor(props: CommandEmptyStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly role: "presentation";
        readonly "data-command-empty": "";
    };
}
type CommandGroupContainerStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
    forceMount: boolean;
}>>;
declare class CommandGroupContainerState {
    #private;
    id: CommandGroupContainerStateProps["id"];
    forceMount: CommandGroupContainerStateProps["forceMount"];
    headingNode: HTMLElement | null;
    shouldRender: boolean;
    trueValue: string;
    constructor(props: CommandGroupContainerStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly role: "presentation";
        readonly hidden: true | undefined;
        readonly "data-value": string;
        readonly "data-command-group": "";
    };
    createGroupHeading(props: CommandGroupHeadingStateProps): CommandGroupHeadingState;
    createGroupItems(props: CommandGroupItemsStateProps): CommandGroupItemsState;
}
type CommandGroupHeadingStateProps = WithRefProps;
declare class CommandGroupHeadingState {
    #private;
    constructor(props: CommandGroupHeadingStateProps, group: CommandGroupContainerState);
    props: {
        readonly id: string;
        readonly "data-command-group-heading": "";
    };
}
type CommandGroupItemsStateProps = WithRefProps;
declare class CommandGroupItemsState {
    #private;
    constructor(props: CommandGroupItemsStateProps, group: CommandGroupContainerState);
    props: {
        readonly id: string;
        readonly role: "group";
        readonly "data-command-group-items": "";
        readonly "aria-labelledby": string | undefined;
    };
}
type CommandInputStateProps = WithRefProps<WritableBoxedValues<{
    value: string;
}> & ReadableBoxedValues<{
    autofocus: boolean;
}>>;
declare class CommandInputState {
    #private;
    constructor(props: CommandInputStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly type: "text";
        readonly "data-command-input": "";
        readonly autocomplete: "off";
        readonly autocorrect: "off";
        readonly spellcheck: false;
        readonly "aria-autocomplete": "list";
        readonly role: "combobox";
        readonly "aria-expanded": "true" | "false";
        readonly "aria-controls": string | undefined;
        readonly "aria-labelledby": string | undefined;
        readonly "aria-activedescendant": string | undefined;
    };
}
type CommandItemStateProps = WithRefProps<ReadableBoxedValues<{
    value: string;
    disabled: boolean;
    onSelect: () => void;
    forceMount: boolean;
    keywords: string[];
}> & {
    group: CommandGroupContainerState | null;
}>;
declare class CommandItemState {
    #private;
    id: CommandItemStateProps["id"];
    root: CommandRootState;
    trueValue: string;
    shouldRender: boolean;
    isSelected: boolean;
    constructor(props: CommandItemStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-selected": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-selected": "" | undefined;
        readonly "data-command-item": "";
        readonly role: "option";
        readonly onpointermove: () => void;
        readonly onclick: () => void;
    };
}
type CommandLoadingStateProps = WithRefProps<ReadableBoxedValues<{
    progress: number;
}>>;
declare class CommandLoadingState {
    #private;
    constructor(props: CommandLoadingStateProps);
    props: {
        readonly id: string;
        readonly role: "progressbar";
        readonly "aria-valuenow": number;
        readonly "aria-valuemin": 0;
        readonly "aria-valuemax": 100;
        readonly "aria-label": "Loading...";
        readonly "data-command-loading": "";
    };
}
type CommandSeparatorStateProps = WithRefProps & ReadableBoxedValues<{
    forceMount: boolean;
}>;
declare class CommandSeparatorState {
    #private;
    shouldRender: boolean;
    constructor(props: CommandSeparatorStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly role: "separator";
        readonly "data-command-separator": "";
    };
}
type CommandListStateProps = WithRefProps & ReadableBoxedValues<{
    ariaLabel: string;
}>;
declare class CommandListState {
    #private;
    ref: CommandListStateProps["ref"];
    root: CommandRootState;
    constructor(props: CommandListStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly role: "listbox";
        readonly "aria-label": string;
        readonly "data-command-list": "";
    };
}
type CommandLabelStateProps = WithRefProps<ReadableBoxedValues<{
    for?: string;
}>>;
declare class CommandLabelState {
    #private;
    constructor(props: CommandLabelStateProps, root: CommandRootState);
    props: {
        readonly id: string;
        readonly "data-command-input-label": "";
        readonly for: string | undefined;
        readonly style: import("svelte-toolbelt").StyleProperties;
    };
}
type CommandViewportStateProps = WithRefProps;
declare class CommandViewportState {
    #private;
    constructor(props: CommandViewportStateProps, list: CommandListState);
    props: {
        readonly id: string;
        readonly "data-command-viewport": "";
    };
}
export declare function useCommandRoot(props: CommandRootStateProps): CommandRootState;
export declare function useCommandEmpty(props: CommandEmptyStateProps): CommandEmptyState;
export declare function useCommandItem(props: CommandItemStateProps): CommandItemState;
export declare function useCommandGroupContainer(props: CommandGroupContainerStateProps): CommandGroupContainerState;
export declare function useCommandGroupHeading(props: CommandGroupHeadingStateProps): CommandGroupHeadingState;
export declare function useCommandGroupItems(props: CommandGroupItemsStateProps): CommandGroupItemsState;
export declare function useCommandInput(props: CommandInputStateProps): CommandInputState;
export declare function useCommandLoading(props: CommandLoadingStateProps): CommandLoadingState;
export declare function useCommandSeparator(props: CommandSeparatorStateProps): CommandSeparatorState;
export declare function useCommandList(props: CommandListStateProps): CommandListState;
export declare function useCommandViewport(props: CommandViewportStateProps): CommandViewportState;
export declare function useCommandLabel(props: CommandLabelStateProps): CommandLabelState;
export {};
