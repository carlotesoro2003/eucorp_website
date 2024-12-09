import type { DateValue } from "@internationalized/date";
import type { DateFieldRootState } from "../date-field/date-field.svelte.js";
import { DateFieldInputState } from "../date-field/date-field.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { DateOnInvalid, DateRange, DateRangeValidator, SegmentPart } from "../../shared/index.js";
import type { WithRefProps } from "../../internal/types.js";
import type { Granularity } from "../../shared/date/types.js";
import { type Formatter } from "../../internal/date-time/formatter.js";
export declare const DATE_RANGE_FIELD_ROOT_ATTR = "data-date-range-field-root";
type DateRangeFieldRootStateProps = WithRefProps<WritableBoxedValues<{
    value: DateRange;
    placeholder: DateValue;
    startValue: DateValue | undefined;
    endValue: DateValue | undefined;
}> & ReadableBoxedValues<{
    readonlySegments: SegmentPart[];
    validate: DateRangeValidator | undefined;
    onInvalid: DateOnInvalid | undefined;
    minValue: DateValue | undefined;
    maxValue: DateValue | undefined;
    disabled: boolean;
    readonly: boolean;
    granularity: Granularity | undefined;
    hourCycle: 12 | 24 | undefined;
    locale: string;
    hideTimeZone: boolean;
    required: boolean;
    errorMessageId: string | undefined;
}>>;
export declare class DateRangeFieldRootState {
    ref: DateRangeFieldRootStateProps["ref"];
    id: DateRangeFieldRootStateProps["id"];
    value: DateRangeFieldRootStateProps["value"];
    placeholder: DateRangeFieldRootStateProps["placeholder"];
    readonlySegments: DateRangeFieldRootStateProps["readonlySegments"];
    validate: DateRangeFieldRootStateProps["validate"];
    minValue: DateRangeFieldRootStateProps["minValue"];
    maxValue: DateRangeFieldRootStateProps["maxValue"];
    disabled: DateRangeFieldRootStateProps["disabled"];
    readonly: DateRangeFieldRootStateProps["readonly"];
    granularity: DateRangeFieldRootStateProps["granularity"];
    hourCycle: DateRangeFieldRootStateProps["hourCycle"];
    locale: DateRangeFieldRootStateProps["locale"];
    hideTimeZone: DateRangeFieldRootStateProps["hideTimeZone"];
    required: DateRangeFieldRootStateProps["required"];
    startValue: DateRangeFieldRootStateProps["startValue"];
    endValue: DateRangeFieldRootStateProps["endValue"];
    onInvalid: DateRangeFieldRootStateProps["onInvalid"];
    errorMessageId: DateRangeFieldRootStateProps["errorMessageId"];
    startFieldState: DateFieldRootState | undefined;
    endFieldState: DateFieldRootState | undefined;
    descriptionId: string;
    formatter: Formatter;
    fieldNode: HTMLElement | null;
    labelNode: HTMLElement | null;
    descriptionNode: HTMLElement | null;
    startValueComplete: boolean;
    endValueComplete: boolean;
    rangeComplete: boolean;
    mergedValues: {
        start: undefined;
        end: undefined;
    } | {
        start: DateValue;
        end: DateValue;
    };
    constructor(props: DateRangeFieldRootStateProps);
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
    setStartValue: (value: DateValue | undefined) => void;
    setEndValue: (value: DateValue | undefined) => void;
    /**
     * These props are used to override those of the child fields.
     * TODO:
     */
    childFieldPropOverrides: {};
    props: {
        readonly id: string;
        readonly role: "group";
        readonly "data-date-range-field-root": "";
        readonly "data-invalid": "" | undefined;
    };
}
type DateRangeFieldLabelStateProps = WithRefProps;
declare class DateRangeFieldLabelState {
    #private;
    constructor(props: DateRangeFieldLabelStateProps, root: DateRangeFieldRootState);
    props: {
        readonly id: string;
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-date-range-field-label": "";
        readonly onclick: () => void;
    };
}
type DateRangeFieldInputStateProps = WritableBoxedValues<{
    value: DateValue | undefined;
}> & ReadableBoxedValues<{
    name: string;
}> & WithRefProps;
declare const getDateRangeFieldRootContext: <T extends DateRangeFieldRootState | null | undefined = DateRangeFieldRootState>(fallback?: T | undefined) => T extends null ? DateRangeFieldRootState | null : DateRangeFieldRootState;
export declare function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps): DateRangeFieldRootState;
export declare function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps): DateRangeFieldLabelState;
export declare function useDateRangeFieldInput(props: Omit<DateRangeFieldInputStateProps, "value">, type: "start" | "end"): DateFieldInputState;
export { getDateRangeFieldRootContext };
