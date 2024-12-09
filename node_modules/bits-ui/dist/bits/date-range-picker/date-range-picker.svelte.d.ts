import type { DateValue } from "@internationalized/date";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { DateMatcher, DateRange, SegmentPart } from "../../shared/index.js";
import type { Granularity, HourCycle, WeekStartsOn } from "../../shared/date/types.js";
type DateRangePickerRootStateProps = WritableBoxedValues<{
    value: DateRange;
    startValue: DateValue | undefined;
    endValue: DateValue | undefined;
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
    onRangeSelect?: () => void;
}>;
declare class DateRangePickerRootState {
    readonly props: DateRangePickerRootStateProps;
    constructor(props: DateRangePickerRootStateProps);
}
export declare const setDateRangePickerRootContext: (value: DateRangePickerRootState) => DateRangePickerRootState, getDateRangePickerRootContext: <T extends DateRangePickerRootState | null | undefined = DateRangePickerRootState>(fallback?: T | undefined) => T extends null ? DateRangePickerRootState | null : DateRangePickerRootState;
export declare function useDateRangePickerRoot(props: DateRangePickerRootStateProps): DateRangePickerRootState;
export {};
