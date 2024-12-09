import { type DateValue } from "@internationalized/date";
import type { RangeCalendarRootState } from "../range-calendar/range-calendar.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "../../internal/box.svelte.js";
import type { WithRefProps } from "../../internal/types.js";
import type { DateMatcher, Month } from "../../shared/index.js";
import { type Announcer } from "../../internal/date-time/announcer.js";
import { type Formatter } from "../../internal/date-time/formatter.js";
import { type CalendarParts } from "../../internal/date-time/calendar-helpers.svelte.js";
type CalendarRootStateProps = WithRefProps<WritableBoxedValues<{
    value: DateValue | undefined | DateValue[];
    placeholder: DateValue;
}> & ReadableBoxedValues<{
    preventDeselect: boolean;
    minValue: DateValue | undefined;
    maxValue: DateValue | undefined;
    disabled: boolean;
    pagedNavigation: boolean;
    weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
    isDateDisabled: DateMatcher;
    isDateUnavailable: DateMatcher;
    fixedWeeks: boolean;
    numberOfMonths: number;
    locale: string;
    calendarLabel: string;
    type: "single" | "multiple";
    readonly: boolean;
    disableDaysOutsideMonth: boolean;
    initialFocus: boolean;
    /**
     * This is strictly used by the `DatePicker` component to close the popover when a date
     * is selected. It is not intended to be used by the user.
     */
    onDateSelect?: () => void;
}>>;
export declare class CalendarRootState {
    #private;
    ref: CalendarRootStateProps["ref"];
    id: CalendarRootStateProps["id"];
    value: CalendarRootStateProps["value"];
    placeholder: CalendarRootStateProps["placeholder"];
    preventDeselect: CalendarRootStateProps["preventDeselect"];
    minValue: CalendarRootStateProps["minValue"];
    maxValue: CalendarRootStateProps["maxValue"];
    disabled: CalendarRootStateProps["disabled"];
    pagedNavigation: CalendarRootStateProps["pagedNavigation"];
    weekStartsOn: CalendarRootStateProps["weekStartsOn"];
    weekdayFormat: CalendarRootStateProps["weekdayFormat"];
    isDateDisabledProp: CalendarRootStateProps["isDateDisabled"];
    isDateUnavailableProp: CalendarRootStateProps["isDateUnavailable"];
    fixedWeeks: CalendarRootStateProps["fixedWeeks"];
    numberOfMonths: CalendarRootStateProps["numberOfMonths"];
    locale: CalendarRootStateProps["locale"];
    calendarLabel: CalendarRootStateProps["calendarLabel"];
    type: CalendarRootStateProps["type"];
    readonly: CalendarRootStateProps["readonly"];
    disableDaysOutsideMonth: CalendarRootStateProps["disableDaysOutsideMonth"];
    onDateSelect: CalendarRootStateProps["onDateSelect"];
    initialFocus: CalendarRootStateProps["initialFocus"];
    months: Month<DateValue>[];
    visibleMonths: DateValue[];
    announcer: Announcer;
    formatter: Formatter;
    accessibleHeadingId: string;
    constructor(props: CalendarRootStateProps);
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    weekdays: string[];
    /**
     * Navigates to the next page of the calendar.
     */
    nextPage: () => void;
    /**
     * Navigates to the previous page of the calendar.
     */
    prevPage: () => void;
    nextYear: () => void;
    prevYear: () => void;
    setYear: (year: number) => void;
    setMonth: (month: number) => void;
    isNextButtonDisabled: boolean;
    isPrevButtonDisabled: boolean;
    isInvalid: boolean;
    headingValue: string;
    fullCalendarLabel: string;
    isOutsideVisibleMonths: (date: DateValue) => boolean;
    isDateDisabled: (date: DateValue) => boolean;
    isDateSelected: (date: DateValue) => boolean;
    handleCellClick: (_: Event, date: DateValue) => void;
    snippetProps: {
        months: Month<DateValue>[];
        weekdays: string[];
    };
    getBitsAttr: (part: CalendarParts) => string;
    props: {
        readonly onkeydown: (event: KeyboardEvent) => void;
        readonly id: string;
        readonly role: "application";
        readonly "aria-label": string;
        readonly "data-invalid": "" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export type CalendarHeadingStateProps = WithRefProps;
export declare class CalendarHeadingState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarHeadingStateProps["id"];
    ref: CalendarHeadingStateProps["ref"];
    headingValue: string;
    constructor(props: CalendarHeadingStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "aria-hidden": "true" | undefined;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
type CalendarCellStateProps = WithRefProps<ReadableBoxedValues<{
    date: DateValue;
    month: DateValue;
}>>;
declare class CalendarCellState {
    readonly root: CalendarRootState;
    id: CalendarCellStateProps["id"];
    ref: CalendarCellStateProps["ref"];
    date: CalendarCellStateProps["date"];
    month: CalendarCellStateProps["month"];
    cellDate: Date;
    isDisabled: boolean;
    isUnavailable: boolean;
    isDateToday: boolean;
    isOutsideMonth: boolean;
    isOutsideVisibleMonths: boolean;
    isFocusedDate: boolean;
    isSelectedDate: boolean;
    labelText: string;
    constructor(props: CalendarCellStateProps, root: CalendarRootState);
    snippetProps: {
        disabled: boolean;
        unavailable: boolean;
        selected: boolean;
    };
    ariaDisabled: boolean;
    sharedDataAttrs: {
        readonly "data-unavailable": "" | undefined;
        readonly "data-today": "" | undefined;
        readonly "data-outside-month": "" | undefined;
        readonly "data-outside-visible-months": "" | undefined;
        readonly "data-focused": "" | undefined;
        readonly "data-selected": "" | undefined;
        readonly "data-value": string;
        readonly "data-disabled": "" | undefined;
    };
    props: {
        readonly "data-unavailable": "" | undefined;
        readonly "data-today": "" | undefined;
        readonly "data-outside-month": "" | undefined;
        readonly "data-outside-visible-months": "" | undefined;
        readonly "data-focused": "" | undefined;
        readonly "data-selected": "" | undefined;
        readonly "data-value": string;
        readonly "data-disabled": "" | undefined;
        readonly id: string;
        readonly role: "gridcell";
        readonly "aria-selected": "true" | "false";
        readonly "aria-disabled": "true" | "false";
    };
}
type CalendarDayStateProps = WithRefProps;
declare class CalendarDayState {
    #private;
    readonly cell: CalendarCellState;
    id: CalendarDayStateProps["id"];
    ref: CalendarDayStateProps["ref"];
    constructor(props: CalendarDayStateProps, cell: CalendarCellState);
    snippetProps: {
        disabled: boolean;
        unavailable: boolean;
        selected: boolean;
        day: string;
    };
    props: {
        readonly tabindex: number | undefined;
        readonly "data-bits-day": "";
        readonly onclick: (e: MouseEvent) => void;
        readonly "data-unavailable": "" | undefined;
        readonly "data-today": "" | undefined;
        readonly "data-outside-month": "" | undefined;
        readonly "data-outside-visible-months": "" | undefined;
        readonly "data-focused": "" | undefined;
        readonly "data-selected": "" | undefined;
        readonly "data-value": string;
        readonly "data-disabled": "" | undefined;
        readonly id: string;
        readonly role: "button";
        readonly "aria-label": string;
        readonly "aria-disabled": "true" | "false";
    };
}
export type CalendarNextButtonStateProps = WithRefProps;
export declare class CalendarNextButtonState {
    #private;
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarNextButtonStateProps["id"];
    ref: CalendarNextButtonStateProps["ref"];
    isDisabled: boolean;
    constructor(props: CalendarNextButtonStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | boolean | (() => void) | undefined;
        readonly id: string;
        readonly role: "button";
        readonly type: "button";
        readonly "aria-label": "Next";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly disabled: boolean;
        readonly onclick: () => void;
    };
}
export type CalendarPrevButtonStateProps = WithRefProps;
export declare class CalendarPrevButtonState {
    #private;
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarPrevButtonStateProps["id"];
    ref: CalendarPrevButtonStateProps["ref"];
    isDisabled: boolean;
    constructor(props: CalendarPrevButtonStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | boolean | (() => void) | undefined;
        readonly id: string;
        readonly role: "button";
        readonly type: "button";
        readonly "aria-label": "Previous";
        readonly "aria-disabled": "true" | "false";
        readonly "data-disabled": "" | undefined;
        readonly disabled: boolean;
        readonly onclick: () => void;
    };
}
export type CalendarGridStateProps = WithRefProps;
export declare class CalendarGridState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarGridStateProps["id"];
    ref: CalendarGridStateProps["ref"];
    constructor(props: CalendarGridStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | -1 | undefined;
        readonly id: string;
        readonly tabindex: -1;
        readonly role: "grid";
        readonly "aria-readonly": "true" | "false";
        readonly "aria-disabled": "true" | "false";
        readonly "data-readonly": "" | undefined;
        readonly "data-disabled": "" | undefined;
    };
}
export type CalendarGridBodyStateProps = WithRefProps;
export declare class CalendarGridBodyState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarGridBodyStateProps["id"];
    ref: CalendarGridBodyStateProps["ref"];
    constructor(props: CalendarGridBodyStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export type CalendarGridHeadStateProps = WithRefProps;
export declare class CalendarGridHeadState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarGridHeadStateProps["id"];
    ref: CalendarGridHeadStateProps["ref"];
    constructor(props: CalendarGridHeadStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export type CalendarGridRowStateProps = WithRefProps;
export declare class CalendarGridRowState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarGridRowStateProps["id"];
    ref: CalendarGridRowStateProps["ref"];
    constructor(props: CalendarGridRowStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export type CalendarHeadCellStateProps = WithRefProps;
export declare class CalendarHeadCellState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarHeadCellStateProps["id"];
    ref: CalendarHeadCellStateProps["ref"];
    constructor(props: CalendarHeadCellStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export type CalendarHeaderStateProps = WithRefProps;
export declare class CalendarHeaderState {
    readonly root: CalendarRootState | RangeCalendarRootState;
    id: CalendarHeaderStateProps["id"];
    ref: CalendarHeaderStateProps["ref"];
    constructor(props: CalendarHeaderStateProps, root: CalendarRootState | RangeCalendarRootState);
    props: {
        readonly [x: string]: string | undefined;
        readonly id: string;
        readonly "data-disabled": "" | undefined;
        readonly "data-readonly": "" | undefined;
    };
}
export declare function useCalendarRoot(props: CalendarRootStateProps): CalendarRootState;
export declare function useCalendarGrid(props: CalendarGridStateProps): CalendarGridState;
export declare function useCalendarCell(props: CalendarCellStateProps): CalendarCellState;
export declare function useCalendarNextButton(props: CalendarNextButtonStateProps): CalendarNextButtonState;
export declare function useCalendarPrevButton(props: CalendarPrevButtonStateProps): CalendarPrevButtonState;
export declare function useCalendarDay(props: CalendarDayStateProps): CalendarDayState;
export declare function useCalendarGridBody(props: CalendarGridBodyStateProps): CalendarGridBodyState;
export declare function useCalendarGridHead(props: CalendarGridHeadStateProps): CalendarGridHeadState;
export declare function useCalendarGridRow(props: CalendarGridRowStateProps): CalendarGridRowState;
export declare function useCalendarHeadCell(props: CalendarHeadCellStateProps): CalendarHeadCellState;
export declare function useCalendarHeader(props: CalendarHeaderStateProps): CalendarHeaderState;
export declare function useCalendarHeading(props: CalendarHeadingStateProps): CalendarHeadingState;
export {};
