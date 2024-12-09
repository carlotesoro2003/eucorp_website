import type { HTMLButtonAttributes } from "svelte/elements";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
type CheckboxRootStateProps = WithRefProps<ReadableBoxedValues<{
    disabled: boolean;
    required: boolean;
    name: string | undefined;
    value: string | undefined;
    type: HTMLButtonAttributes["type"];
}> & WritableBoxedValues<{
    checked: boolean;
    indeterminate: boolean;
}>>;
declare class CheckboxRootState {
    #private;
    checked: CheckboxRootStateProps["checked"];
    disabled: CheckboxRootStateProps["disabled"];
    required: CheckboxRootStateProps["required"];
    name: CheckboxRootStateProps["name"];
    value: CheckboxRootStateProps["value"];
    indeterminate: CheckboxRootStateProps["indeterminate"];
    constructor(props: CheckboxRootStateProps);
    props: {
        readonly id: string;
        readonly role: "checkbox";
        readonly type: "button" | "reset" | "submit" | null | undefined;
        readonly disabled: boolean;
        readonly "aria-checked": "true" | "false" | "mixed";
        readonly "aria-required": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly "data-state": "checked" | "indeterminate" | "unchecked";
        readonly "data-checkbox-root": "";
        readonly onclick: () => void;
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
declare class CheckboxInputState {
    root: CheckboxRootState;
    shouldRender: boolean;
    constructor(root: CheckboxRootState);
    props: {
        readonly type: "checkbox";
        readonly checked: boolean;
        readonly disabled: boolean;
        readonly required: boolean;
        readonly name: string | undefined;
        readonly value: string | undefined;
        readonly "aria-hidden": "true";
        readonly style: string;
    };
}
export declare function useCheckboxRoot(props: CheckboxRootStateProps): CheckboxRootState;
export declare function useCheckboxInput(): CheckboxInputState;
export {};
