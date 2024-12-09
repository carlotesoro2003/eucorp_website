import type { DateValue } from "@internationalized/date";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { DateMatcher, SegmentPart } from "../../shared/index.js";
import type { Granularity, HourCycle, WeekStartsOn } from "../../shared/date/types.js";
type DatePickerRootStateProps = WritableBoxedValues<{
    value: DateValue | undefined;
    open: boolean;
    placeholder: DateValue;
}> & ReadableBoxedValues<{
    readonlySegments: SegmentPart[];
    isDateUnavailable: DateMatcher;
    isDateDisabled: DateMatcher;
    minValue: DateValue | undefined;
    maxValue: DateValue | undefined;
    disabled: boolean;
    readonly: boolean;
    granularity: Granularity | undefined;
    hourCycle: HourCycle | undefined;
    locale: string;
    hideTimeZone: boolean;
    required: boolean;
    preventDeselect: boolean;
    pagedNavigation: boolean;
    weekStartsOn: WeekStartsOn;
    weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
    fixedWeeks: boolean;
    numberOfMonths: number;
    calendarLabel: string;
    disableDaysOutsideMonth: boolean;
    initialFocus: boolean;
    onDateSelect?: () => void;
}>;
declare class DatePickerRootState {
    readonly props: DatePickerRootStateProps;
    constructor(props: DatePickerRootStateProps);
}
export declare const setDatePickerRootContext: (value: DatePickerRootState) => DatePickerRootState, getDatePickerRootContext: <T extends DatePickerRootState | null | undefined = DatePickerRootState>(fallback?: T | undefined) => T extends null ? DatePickerRootState | null : DatePickerRootState;
export declare function useDatePickerRoot(props: DatePickerRootStateProps): DatePickerRootState;
export {};
