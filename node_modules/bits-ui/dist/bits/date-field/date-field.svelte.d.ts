import type { Updater } from "svelte/store";
import type { DateValue } from "@internationalized/date";
import { type WritableBox } from "svelte-toolbelt";
import type { DateRangeFieldRootState } from "../date-range-field/date-range-field.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
import type { DateAndTimeSegmentObj, DateOnInvalid, DateSegmentObj, DateSegmentPart, DateValidator, Granularity, HourCycle, SegmentPart, SegmentValueObj, TimeSegmentObj, TimeSegmentPart } from "../../shared/date/types.js";
import { type Formatter } from "../../internal/date-time/formatter.js";
import { type Announcer } from "../../internal/date-time/announcer.js";
export declare const DATE_FIELD_INPUT_ATTR = "data-date-field-input";
export type DateFieldRootStateProps = WritableBoxedValues<{
    value: DateValue | undefined;
    placeholder: DateValue;
}> & ReadableBoxedValues<{
    readonlySegments: SegmentPart[];
    validate: DateValidator | undefined;
    onInvalid: DateOnInvalid | undefined;
    minValue: DateValue | undefined;
    maxValue: DateValue | undefined;
    disabled: boolean;
    readonly: boolean;
    granularity: Granularity | undefined;
    hourCycle: HourCycle | undefined;
    locale: string;
    hideTimeZone: boolean;
    required: boolean;
    errorMessageId: string | undefined;
    isInvalidProp: boolean | undefined;
}>;
export declare class DateFieldRootState {
    #private;
    value: DateFieldRootStateProps["value"];
    placeholder: WritableBox<DateValue>;
    validate: DateFieldRootStateProps["validate"];
    minValue: DateFieldRootStateProps["minValue"];
    maxValue: DateFieldRootStateProps["maxValue"];
    disabled: DateFieldRootStateProps["disabled"];
    readonly: DateFieldRootStateProps["readonly"];
    granularity: DateFieldRootStateProps["granularity"];
    readonlySegments: DateFieldRootStateProps["readonlySegments"];
    hourCycle: DateFieldRootStateProps["hourCycle"];
    locale: DateFieldRootStateProps["locale"];
    hideTimeZone: DateFieldRootStateProps["hideTimeZone"];
    required: DateFieldRootStateProps["required"];
    onInvalid: DateFieldRootStateProps["onInvalid"];
    errorMessageId: DateFieldRootStateProps["errorMessageId"];
    isInvalidProp: DateFieldRootStateProps["isInvalidProp"];
    descriptionId: string;
    formatter: Formatter;
    initialSegments: SegmentValueObj;
    segmentValues: SegmentValueObj;
    announcer: Announcer;
    readonlySegmentsSet: Set<SegmentPart>;
    segmentStates: import("../../internal/date-time/field/types.js").SegmentStateMap;
    descriptionNode: HTMLElement | null;
    validationNode: HTMLElement | null;
    states: import("../../internal/date-time/field/types.js").SegmentStateMap;
    dayPeriodNode: HTMLElement | null;
    rangeRoot: DateRangeFieldRootState | undefined;
    name: string;
    constructor(props: DateFieldRootStateProps, rangeRoot?: DateRangeFieldRootState);
    setName: (name: string) => void;
    /**
     * Sets the field node for the `DateFieldRootState` instance. We use this method so we can
     * keep `#fieldNode` private to prevent accidental usage of the incorrect field node.
     */
    setFieldNode: (node: HTMLElement | null) => void;
    /**
     * Gets the correct field node for the date field regardless of whether it's being
     * used in a standalone context or within a `DateRangeField` component.
     */
    getFieldNode: () => HTMLElement | null;
    /**
     * Sets the label node for the `DateFieldRootState` instance. We use this method so we can
     * keep `#labelNode` private to prevent accidental usage of the incorrect label node.
     */
    setLabelNode: (node: HTMLElement | null) => void;
    /**
     * Gets the correct label node for the date field regardless of whether it's being used in
     * a standalone context or within a `DateRangeField` component.
     */
    getLabelNode: () => HTMLElement | null;
    clearUpdating: () => void;
    setValue(value: DateValue | undefined): void;
    syncSegmentValues(value: DateValue): void;
    validationStatus: false | {
        readonly reason: "custom";
        readonly message: string | string[];
    } | {
        readonly reason: "min";
        readonly message?: undefined;
    } | {
        readonly reason: "max";
        readonly message?: undefined;
    };
    isInvalid: boolean;
    inferredGranularity: Granularity;
    allSegmentContent: {
        obj: import("../../internal/date-time/field/types.js").SegmentContentObj;
        arr: {
            part: import("../../internal/date-time/field/types.js").SegmentPart;
            value: string;
        }[];
    };
    segmentContents: {
        part: import("../../internal/date-time/field/types.js").SegmentPart;
        value: string;
    }[];
    sharedSegmentAttrs: {
        role: string;
        contenteditable: string;
        tabindex: number;
        spellcheck: boolean;
        inputmode: string;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    };
    getLabelledBy: (segmentId: string) => string;
    updateSegment: <T extends keyof DateAndTimeSegmentObj>(part: T, cb: T extends DateSegmentPart ? Updater<DateSegmentObj[T]> : T extends TimeSegmentPart ? Updater<TimeSegmentObj[T]> : Updater<DateAndTimeSegmentObj[T]>) => void;
    handleSegmentClick: (e: MouseEvent) => void;
    getBaseSegmentAttrs: (part: SegmentPart, segmentId: string) => {
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
    } | {
        "aria-labelledby": string;
        contenteditable: string | undefined;
        "aria-describedby": string | undefined;
        tabindex: number | undefined;
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
    };
}
type DateFieldInputStateProps = WithRefProps & ReadableBoxedValues<{
    name: string;
}>;
export declare class DateFieldInputState {
    #private;
    root: DateFieldRootState;
    constructor(props: DateFieldInputStateProps, root: DateFieldRootState);
    props: {
        readonly id: string;
        readonly role: "group";
        readonly "aria-labelledby": string | undefined;
        readonly "aria-describedby": string | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-date-field-input": "";
    };
}
declare class DateFieldHiddenInputState {
    #private;
    shouldRender: boolean;
    isoValue: string;
    constructor(root: DateFieldRootState);
    props: {
        name: string;
        value: string;
        required: boolean;
        "aria-hidden": "true" | undefined;
    };
}
type DateFieldLabelStateProps = WithRefProps;
declare class DateFieldLabelState {
    #private;
    constructor(props: DateFieldLabelStateProps, root: DateFieldRootState);
    props: {
        readonly id: string;
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-date-field-label": "";
        readonly onclick: () => void;
    };
}
type DateFieldDaySegmentStateProps = WithRefProps;
declare class DateFieldDaySegmentState {
    #private;
    constructor(props: DateFieldDaySegmentStateProps, root: DateFieldRootState);
    props: {
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number;
        "aria-valuetext": string;
        onkeydown: (e: KeyboardEvent) => void;
        onfocusout: () => void;
        onclick: (e: MouseEvent) => void;
        role: string;
        contenteditable: string;
        tabindex: number;
        spellcheck: boolean;
        inputmode: string;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    } | {
        "aria-labelledby": string;
        contenteditable: string | undefined;
        "aria-describedby": string | undefined;
        tabindex: number | undefined;
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number;
        "aria-valuetext": string;
        onkeydown: (e: KeyboardEvent) => void;
        onfocusout: () => void;
        onclick: (e: MouseEvent) => void;
        role: string;
        spellcheck: boolean;
        inputmode: string;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    };
}
type DateFieldMonthSegmentStateProps = WithRefProps;
declare class DateFieldMonthSegmentState {
    #private;
    constructor(props: DateFieldMonthSegmentStateProps, root: DateFieldRootState);
    getAnnouncement: (month: number) => string;
    props: {
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
        readonly "data-segment": string;
        readonly id: string;
        readonly "aria-label": "month, ";
        readonly contenteditable: "true";
        readonly "aria-valuemin": 1;
        readonly "aria-valuemax": 12;
        readonly "aria-valuenow": number;
        readonly "aria-valuetext": string;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onfocusout: () => void;
        readonly onclick: (e: MouseEvent) => void;
        readonly role: string;
        readonly tabindex: number;
        readonly spellcheck: boolean;
        readonly inputmode: string;
        readonly autocorrect: string;
        readonly enterkeyhint: string;
        readonly style: {
            caretColor: string;
        };
    } | {
        readonly "aria-labelledby": string;
        readonly contenteditable: string | undefined;
        readonly "aria-describedby": string | undefined;
        readonly tabindex: number | undefined;
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
        readonly "data-segment": string;
        readonly id: string;
        readonly "aria-label": "month, ";
        readonly "aria-valuemin": 1;
        readonly "aria-valuemax": 12;
        readonly "aria-valuenow": number;
        readonly "aria-valuetext": string;
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly onfocusout: () => void;
        readonly onclick: (e: MouseEvent) => void;
        readonly role: string;
        readonly spellcheck: boolean;
        readonly inputmode: string;
        readonly autocorrect: string;
        readonly enterkeyhint: string;
        readonly style: {
            caretColor: string;
        };
    };
}
type DateFieldYearSegmentStateProps = WithRefProps;
declare class DateFieldYearSegmentState {
    #private;
    constructor(props: DateFieldYearSegmentStateProps, root: DateFieldRootState);
    props: {
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number;
        "aria-valuetext": string;
        onkeydown: (e: KeyboardEvent) => void;
        onclick: (e: MouseEvent) => void;
        onfocusout: () => void;
        role: string;
        contenteditable: string;
        tabindex: number;
        spellcheck: boolean;
        inputmode: string;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    } | {
        "aria-labelledby": string;
        contenteditable: string | undefined;
        "aria-describedby": string | undefined;
        tabindex: number | undefined;
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number;
        "aria-valuetext": string;
        onkeydown: (e: KeyboardEvent) => void;
        onclick: (e: MouseEvent) => void;
        onfocusout: () => void;
        role: string;
        spellcheck: boolean;
        inputmode: string;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    };
}
type DateFieldHourSegmentStateProps = WithRefProps;
declare class DateFieldHourSegmentState {
    #private;
    constructor(props: DateFieldHourSegmentStateProps, root: DateFieldRootState);
    props: {};
}
type DateFieldMinuteSegmentStateProps = WithRefProps;
declare class DateFieldMinuteSegmentState {
    #private;
    constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState);
    props: {};
}
type DateFieldSecondSegmentStateProps = WithRefProps;
declare class DateFieldSecondSegmentState {
    #private;
    constructor(props: DateFieldSecondSegmentStateProps, root: DateFieldRootState);
    props: {};
}
type DateFieldDayPeriodSegmentStateProps = WithRefProps;
declare class DateFieldDayPeriodSegmentState {
    #private;
    constructor(props: DateFieldDayPeriodSegmentStateProps, root: DateFieldRootState);
    props: {
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        inputmode: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number | "AM" | "PM";
        "aria-valuetext": "AM" | "PM";
        onkeydown: (e: KeyboardEvent) => void;
        onclick: (e: MouseEvent) => void;
        role: string;
        contenteditable: string;
        tabindex: number;
        spellcheck: boolean;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    } | {
        "aria-labelledby": string;
        contenteditable: string | undefined;
        "aria-describedby": string | undefined;
        tabindex: number | undefined;
        "aria-invalid": "true" | undefined;
        "aria-disabled": "true" | "false";
        "aria-readonly": "true" | "false";
        "data-invalid": "" | undefined;
        "data-disabled": "" | undefined;
        "data-readonly": "" | undefined;
        "data-segment": string;
        id: string;
        inputmode: string;
        "aria-label": string;
        "aria-valuemin": number;
        "aria-valuemax": number;
        "aria-valuenow": number | "AM" | "PM";
        "aria-valuetext": "AM" | "PM";
        onkeydown: (e: KeyboardEvent) => void;
        onclick: (e: MouseEvent) => void;
        role: string;
        spellcheck: boolean;
        autocorrect: string;
        enterkeyhint: string;
        style: {
            caretColor: string;
        };
    } | undefined;
}
type DateFieldLiteralSegmentStateProps = WithRefProps;
declare class DateFieldDayLiteralSegmentState {
    #private;
    constructor(props: DateFieldLiteralSegmentStateProps, root: DateFieldRootState);
    props: {
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
        readonly "data-segment": string;
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
    } | {
        readonly "aria-labelledby": string;
        readonly contenteditable: string | undefined;
        readonly "aria-describedby": string | undefined;
        readonly tabindex: number | undefined;
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
        readonly "data-segment": string;
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
    };
}
declare class DateFieldTimeZoneSegmentState {
    #private;
    constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState);
    props: {
        readonly "data-readonly": "" | undefined;
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-segment": string;
        readonly role: "textbox";
        readonly id: string;
        readonly "aria-label": "timezone, ";
        readonly style: {
            readonly caretColor: "transparent";
        };
        readonly onkeydown: (e: KeyboardEvent) => void;
        readonly tabindex: 0;
    } | {
        readonly "data-readonly": "" | undefined;
        readonly "aria-labelledby": string;
        readonly contenteditable: string | undefined;
        readonly "aria-describedby": string | undefined;
        readonly tabindex: number | undefined;
        readonly "aria-invalid": "true" | undefined;
        readonly "aria-disabled": "true" | "false";
        readonly "aria-readonly": "true" | "false";
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-segment": string;
        readonly role: "textbox";
        readonly id: string;
        readonly "aria-label": "timezone, ";
        readonly style: {
            readonly caretColor: "transparent";
        };
        readonly onkeydown: (e: KeyboardEvent) => void;
    };
}
export declare function useDateFieldRoot(props: DateFieldRootStateProps, rangeRoot?: DateRangeFieldRootState): DateFieldRootState;
export declare function useDateFieldInput(props: DateFieldInputStateProps): DateFieldInputState;
export declare function useDateFieldHiddenInput(): DateFieldHiddenInputState;
export declare function useDateFieldSegment(part: SegmentPart, props: WithRefProps): DateFieldDaySegmentState | DateFieldMonthSegmentState | DateFieldYearSegmentState | DateFieldHourSegmentState | DateFieldMinuteSegmentState | DateFieldSecondSegmentState | DateFieldDayPeriodSegmentState | DateFieldDayLiteralSegmentState | DateFieldTimeZoneSegmentState;
export declare function useDateFieldLabel(props: DateFieldLabelStateProps): DateFieldLabelState;
export {};
