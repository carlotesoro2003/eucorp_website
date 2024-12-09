import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type SwitchRootStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
    required: boolean;
    name: string | undefined;
    value: string;
}> & WritableBoxedValues<{
    checked: boolean;
}>>;
declare class SwitchRootState {
    #private;
    checked: SwitchRootStateProps["checked"];
    disabled: SwitchRootStateProps["disabled"];
    required: SwitchRootStateProps["required"];
    name: SwitchRootStateProps["name"];
    value: SwitchRootStateProps["value"];
    constructor(props: SwitchRootStateProps);
    sharedProps: {
        "data-disabled": "" | undefined;
        "data-state": "checked" | "unchecked";
        "data-required": "" | undefined;
    };
    props: {
        readonly id: string;
        readonly role: "switch";
        readonly disabled: true | undefined;
        readonly "aria-checked": "true" | "false" | "mixed";
        readonly "aria-required": "true" | "false";
        readonly "data-switch-root": "";
        readonly onclick: (e: PointerEvent) => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "checked" | "unchecked";
        readonly "data-required": "" | undefined;
    };
}
declare class SwitchInputState {
    #private;
    shouldRender: boolean;
    constructor(root: SwitchRootState);
    props: {
        readonly type: "checkbox";
        readonly name: string | undefined;
        readonly value: string;
        readonly checked: boolean;
        readonly disabled: boolean;
        readonly required: boolean;
        readonly "aria-hidden": "true" | undefined;
        readonly style: string;
    };
}
type SwitchThumbStateProps = WithRefProps;
declare class SwitchThumbState {
    #private;
    root: SwitchRootState;
    constructor(props: SwitchThumbStateProps, root: SwitchRootState);
    props: {
        readonly id: string;
        readonly "data-switch-thumb": "";
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "checked" | "unchecked";
        readonly "data-required": "" | undefined;
    };
}
export declare function useSwitchRoot(props: SwitchRootStateProps): SwitchRootState;
export declare function useSwitchInput(): SwitchInputState;
export declare function useSwitchThumb(props: SwitchThumbStateProps): SwitchThumbState;
export {};
