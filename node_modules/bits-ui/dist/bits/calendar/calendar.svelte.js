import { getLocalTimeZone, isSameDay, isSameMonth, isToday, } from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";
import { useRefById } from "svelte-toolbelt";
import { getAriaDisabled, getAriaHidden, getAriaReadonly, getAriaSelected, getDataDisabled, getDataReadonly, getDataSelected, getDataUnavailable, } from "../../internal/attrs.js";
import { createContext } from "../../internal/create-context.js";
import { useId } from "../../internal/use-id.js";
import { getAnnouncer } from "../../internal/date-time/announcer.js";
import { createFormatter } from "../../internal/date-time/formatter.js";
import { createAccessibleHeading, createMonths, getCalendarElementProps, getCalendarHeadingValue, getIsNextButtonDisabled, getIsPrevButtonDisabled, getWeekdays, handleCalendarKeydown, handleCalendarNextPage, handleCalendarPrevPage, shiftCalendarFocus, useMonthViewOptionsSync, useMonthViewPlaceholderSync, } from "../../internal/date-time/calendar-helpers.svelte.js";
import { isBefore, toDate } from "../../internal/date-time/utils.js";
export class CalendarRootState {
    ref;
    id;
    value;
    placeholder;
    preventDeselect;
    minValue;
    maxValue;
    disabled;
    pagedNavigation;
    weekStartsOn;
    weekdayFormat;
    isDateDisabledProp;
    isDateUnavailableProp;
    fixedWeeks;
    numberOfMonths;
    locale;
    calendarLabel;
    type;
    readonly;
    disableDaysOutsideMonth;
    onDateSelect;
    initialFocus;
    months = $state([]);
    visibleMonths = $derived.by(() => this.months.map((month) => month.value));
    announcer;
    formatter;
    accessibleHeadingId = useId();
    constructor(props) {
        this.value = props.value;
        this.placeholder = props.placeholder;
        this.preventDeselect = props.preventDeselect;
        this.minValue = props.minValue;
        this.maxValue = props.maxValue;
        this.disabled = props.disabled;
        this.pagedNavigation = props.pagedNavigation;
        this.weekStartsOn = props.weekStartsOn;
        this.weekdayFormat = props.weekdayFormat;
        this.isDateDisabledProp = props.isDateDisabled;
        this.isDateUnavailableProp = props.isDateUnavailable;
        this.fixedWeeks = props.fixedWeeks;
        this.numberOfMonths = props.numberOfMonths;
        this.locale = props.locale;
        this.calendarLabel = props.calendarLabel;
        this.type = props.type;
        this.readonly = props.readonly;
        this.id = props.id;
        this.ref = props.ref;
        this.disableDaysOutsideMonth = props.disableDaysOutsideMonth;
        this.onDateSelect = props.onDateSelect;
        this.initialFocus = props.initialFocus;
        this.announcer = getAnnouncer();
        this.formatter = createFormatter(this.locale.current);
        useRefById({
            id: this.id,
            ref: this.ref,
        });
        this.months = createMonths({
            dateObj: this.placeholder.current,
            weekStartsOn: this.weekStartsOn.current,
            locale: this.locale.current,
            fixedWeeks: this.fixedWeeks.current,
            numberOfMonths: this.numberOfMonths.current,
        });
        $effect(() => {
            const initialFocus = untrack(() => this.initialFocus.current);
            if (initialFocus) {
                // focus the first `data-focused` day node
                const firstFocusedDay = this.ref.current?.querySelector(`[data-focused]`);
                if (firstFocusedDay) {
                    firstFocusedDay.focus();
                }
            }
        });
        $effect(() => {
            if (!this.ref.current)
                return;
            const removeHeading = createAccessibleHeading({
                calendarNode: this.ref.current,
                label: this.fullCalendarLabel,
                accessibleHeadingId: this.accessibleHeadingId,
            });
            return removeHeading;
        });
        $effect(() => {
            if (this.formatter.getLocale() === this.locale.current)
                return;
            this.formatter.setLocale(this.locale.current);
        });
        /**
         * Updates the displayed months based on changes in the placeholder value.
         */
        useMonthViewPlaceholderSync({
            placeholder: this.placeholder,
            getVisibleMonths: () => this.visibleMonths,
            weekStartsOn: this.weekStartsOn,
            locale: this.locale,
            fixedWeeks: this.fixedWeeks,
            numberOfMonths: this.numberOfMonths,
            setMonths: (months) => (this.months = months),
        });
        /**
         * Updates the displayed months based on changes in the options values,
         * which determines the month to show in the calendar.
         */
        useMonthViewOptionsSync({
            fixedWeeks: this.fixedWeeks,
            locale: this.locale,
            numberOfMonths: this.numberOfMonths,
            placeholder: this.placeholder,
            setMonths: this.#setMonths,
            weekStartsOn: this.weekStartsOn,
        });
        /**
         * Update the accessible heading's text content when the `fullCalendarLabel`
         * changes.
         */
        $effect(() => {
            const node = document.getElementById(this.accessibleHeadingId);
            if (!node)
                return;
            node.textContent = this.fullCalendarLabel;
        });
        /**
         * Synchronize the placeholder value with the current value.
         */
        $effect(() => {
            this.value.current;
            untrack(() => {
                const value = this.value.current;
                if (Array.isArray(value) && value.length) {
                    const lastValue = value[value.length - 1];
                    if (lastValue && this.placeholder.current !== lastValue) {
                        this.placeholder.current = lastValue;
                    }
                }
                else if (!Array.isArray(value) && value && this.placeholder.current !== value) {
                    this.placeholder.current = value;
                }
            });
        });
    }
    #setMonths = (months) => (this.months = months);
    /**
     * This derived state holds an array of localized day names for the current
     * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
     * updating its content when the option changes. Using this state to render the
     * calendar's days of the week is strongly recommended, as it guarantees that
     * the days are correctly formatted for the current locale and calendar view.
     */
    weekdays = $derived.by(() => {
        return getWeekdays({
            months: this.months,
            formatter: this.formatter,
            weekdayFormat: this.weekdayFormat.current,
        });
    });
    /**
     * Navigates to the next page of the calendar.
     */
    nextPage = () => {
        handleCalendarNextPage({
            fixedWeeks: this.fixedWeeks.current,
            locale: this.locale.current,
            numberOfMonths: this.numberOfMonths.current,
            pagedNavigation: this.pagedNavigation.current,
            setMonths: this.#setMonths,
            setPlaceholder: (date) => (this.placeholder.current = date),
            weekStartsOn: this.weekStartsOn.current,
            months: this.months,
        });
    };
    /**
     * Navigates to the previous page of the calendar.
     */
    prevPage = () => {
        handleCalendarPrevPage({
            fixedWeeks: this.fixedWeeks.current,
            locale: this.locale.current,
            numberOfMonths: this.numberOfMonths.current,
            pagedNavigation: this.pagedNavigation.current,
            setMonths: this.#setMonths,
            setPlaceholder: (date) => (this.placeholder.current = date),
            weekStartsOn: this.weekStartsOn.current,
            months: this.months,
        });
    };
    nextYear = () => {
        this.placeholder.current = this.placeholder.current.add({ years: 1 });
    };
    prevYear = () => {
        this.placeholder.current = this.placeholder.current.subtract({ years: 1 });
    };
    setYear = (year) => {
        this.placeholder.current = this.placeholder.current.set({ year });
    };
    setMonth = (month) => {
        this.placeholder.current = this.placeholder.current.set({ month });
    };
    isNextButtonDisabled = $derived.by(() => {
        return getIsNextButtonDisabled({
            maxValue: this.maxValue.current,
            months: this.months,
            disabled: this.disabled.current,
        });
    });
    isPrevButtonDisabled = $derived.by(() => {
        return getIsPrevButtonDisabled({
            minValue: this.minValue.current,
            months: this.months,
            disabled: this.disabled.current,
        });
    });
    isInvalid = $derived.by(() => {
        const value = this.value.current;
        const isDateDisabled = this.isDateDisabledProp.current;
        const isDateUnavailable = this.isDateUnavailableProp.current;
        if (Array.isArray(value)) {
            if (!value.length)
                return false;
            for (const date of value) {
                if (isDateDisabled(date))
                    return true;
                if (isDateUnavailable(date))
                    return true;
            }
        }
        else {
            if (!value)
                return false;
            if (isDateDisabled(value))
                return true;
            if (isDateUnavailable(value))
                return true;
        }
        return false;
    });
    headingValue = $derived.by(() => {
        return getCalendarHeadingValue({
            months: this.months,
            formatter: this.formatter,
            locale: this.locale.current,
        });
    });
    fullCalendarLabel = $derived.by(() => {
        return `${this.calendarLabel.current} ${this.headingValue}`;
    });
    isOutsideVisibleMonths = (date) => {
        return !this.visibleMonths.some((month) => isSameMonth(date, month));
    };
    isDateDisabled = (date) => {
        if (this.isDateDisabledProp.current(date) || this.disabled.current)
            return true;
        const minValue = this.minValue.current;
        const maxValue = this.maxValue.current;
        if (minValue && isBefore(date, minValue))
            return true;
        if (maxValue && isBefore(maxValue, date))
            return true;
        return false;
    };
    isDateSelected = (date) => {
        const value = this.value.current;
        if (Array.isArray(value)) {
            return value.some((d) => isSameDay(d, date));
        }
        else if (!value) {
            return false;
        }
        else {
            return isSameDay(value, date);
        }
    };
    #shiftFocus = (node, add) => {
        return shiftCalendarFocus({
            node,
            add,
            placeholder: this.placeholder,
            calendarNode: this.ref.current,
            isPrevButtonDisabled: this.isPrevButtonDisabled,
            isNextButtonDisabled: this.isNextButtonDisabled,
            months: this.months,
            numberOfMonths: this.numberOfMonths.current,
        });
    };
    handleCellClick = (_, date) => {
        const readonly = this.readonly.current;
        if (readonly)
            return;
        const isDateDisabled = this.isDateDisabledProp.current;
        const isDateUnavailable = this.isDateUnavailableProp.current;
        if (isDateDisabled?.(date) || isDateUnavailable?.(date))
            return;
        const prev = this.value.current;
        const multiple = this.type.current === "multiple";
        if (multiple) {
            if (Array.isArray(prev) || prev === undefined) {
                this.value.current = this.#handleMultipleUpdate(prev, date);
            }
        }
        else {
            if (!Array.isArray(prev)) {
                const next = this.#handleSingleUpdate(prev, date);
                if (!next) {
                    this.announcer.announce("Selected date is now empty.", "polite", 5000);
                }
                else {
                    this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(next, false)}`, "polite");
                }
                this.value.current = next;
                if (next !== undefined) {
                    this.onDateSelect?.current?.();
                }
            }
        }
    };
    #handleMultipleUpdate = (prev, date) => {
        if (!prev)
            return [date];
        if (!Array.isArray(prev)) {
            if (DEV)
                throw new Error("Invalid value for multiple prop.");
            return;
        }
        const index = prev.findIndex((d) => isSameDay(d, date));
        const preventDeselect = this.preventDeselect.current;
        if (index === -1) {
            return [...prev, date];
        }
        else if (preventDeselect) {
            return prev;
        }
        else {
            const next = prev.filter((d) => !isSameDay(d, date));
            if (!next.length) {
                this.placeholder.current = date;
                return undefined;
            }
            return next;
        }
    };
    #handleSingleUpdate = (prev, date) => {
        if (Array.isArray(prev)) {
            if (DEV)
                throw new Error("Invalid value for single prop.");
        }
        if (!prev)
            return date;
        const preventDeselect = this.preventDeselect.current;
        if (!preventDeselect && isSameDay(prev, date)) {
            this.placeholder.current = date;
            return undefined;
        }
        return date;
    };
    #onkeydown = (event) => {
        handleCalendarKeydown({
            event,
            handleCellClick: this.handleCellClick,
            shiftFocus: this.#shiftFocus,
            placeholderValue: this.placeholder.current,
        });
    };
    snippetProps = $derived.by(() => ({
        months: this.months,
        weekdays: this.weekdays,
    }));
    getBitsAttr = (part) => {
        return `data-bits-calendar-${part}`;
    };
    props = $derived.by(() => ({
        ...getCalendarElementProps({
            fullCalendarLabel: this.fullCalendarLabel,
            id: this.id.current,
            isInvalid: this.isInvalid,
            disabled: this.disabled.current,
            readonly: this.readonly.current,
        }),
        [this.getBitsAttr("root")]: "",
        //
        onkeydown: this.#onkeydown,
    }));
}
export class CalendarHeadingState {
    root;
    id;
    ref;
    headingValue = $derived.by(() => this.root.headingValue);
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "aria-hidden": getAriaHidden(true),
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("heading")]: "",
    }));
}
class CalendarCellState {
    root;
    id;
    ref;
    date;
    month;
    cellDate = $derived.by(() => toDate(this.date.current));
    isDisabled = $derived.by(() => this.root.isDateDisabled(this.date.current));
    isUnavailable = $derived.by(() => this.root.isDateUnavailableProp.current(this.date.current));
    isDateToday = $derived.by(() => isToday(this.date.current, getLocalTimeZone()));
    isOutsideMonth = $derived.by(() => !isSameMonth(this.date.current, this.month.current));
    isOutsideVisibleMonths = $derived.by(() => this.root.isOutsideVisibleMonths(this.date.current));
    isFocusedDate = $derived.by(() => isSameDay(this.date.current, this.root.placeholder.current));
    isSelectedDate = $derived.by(() => this.root.isDateSelected(this.date.current));
    labelText = $derived.by(() => this.root.formatter.custom(this.cellDate, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    }));
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        this.date = props.date;
        this.month = props.month;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    snippetProps = $derived.by(() => ({
        disabled: this.isDisabled,
        unavailable: this.isUnavailable,
        selected: this.isSelectedDate,
    }));
    ariaDisabled = $derived.by(() => {
        return (this.isDisabled ||
            (this.isOutsideMonth && this.root.disableDaysOutsideMonth.current) ||
            this.isUnavailable);
    });
    sharedDataAttrs = $derived.by(() => ({
        "data-unavailable": getDataUnavailable(this.isUnavailable),
        "data-today": this.isDateToday ? "" : undefined,
        "data-outside-month": this.isOutsideMonth ? "" : undefined,
        "data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
        "data-focused": this.isFocusedDate ? "" : undefined,
        "data-selected": getDataSelected(this.isSelectedDate),
        "data-value": this.date.current.toString(),
        "data-disabled": getDataDisabled(this.isDisabled ||
            (this.isOutsideMonth && this.root.disableDaysOutsideMonth.current)),
    }));
    props = $derived.by(() => ({
        id: this.id.current,
        role: "gridcell",
        "aria-selected": getAriaSelected(this.isSelectedDate),
        "aria-disabled": getAriaDisabled(this.ariaDisabled),
        ...this.sharedDataAttrs,
        [this.root.getBitsAttr("cell")]: "",
    }));
}
class CalendarDayState {
    cell;
    id;
    ref;
    constructor(props, cell) {
        this.cell = cell;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    #tabindex = $derived.by(() => this.cell.isFocusedDate
        ? 0
        : (this.cell.isOutsideMonth && this.cell.root.disableDaysOutsideMonth.current) ||
            this.cell.isDisabled
            ? undefined
            : -1);
    #onclick = (e) => {
        if (this.cell.isDisabled)
            return;
        this.cell.root.handleCellClick(e, this.cell.date.current);
    };
    snippetProps = $derived.by(() => ({
        disabled: this.cell.isDisabled,
        unavailable: this.cell.isUnavailable,
        selected: this.cell.isSelectedDate,
        day: `${this.cell.date.current.day}`,
    }));
    props = $derived.by(() => ({
        id: this.id.current,
        role: "button",
        "aria-label": this.cell.labelText,
        "aria-disabled": getAriaDisabled(this.cell.ariaDisabled),
        ...this.cell.sharedDataAttrs,
        tabindex: this.#tabindex,
        [this.cell.root.getBitsAttr("day")]: "",
        // Shared logic for range calendar and calendar
        "data-bits-day": "",
        //
        onclick: this.#onclick,
    }));
}
export class CalendarNextButtonState {
    root;
    id;
    ref;
    isDisabled = $derived.by(() => this.root.isNextButtonDisabled);
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    #onclick = () => {
        if (this.isDisabled)
            return;
        this.root.nextPage();
    };
    props = $derived.by(() => ({
        id: this.id.current,
        role: "button",
        type: "button",
        "aria-label": "Next",
        "aria-disabled": getAriaDisabled(this.isDisabled),
        "data-disabled": getDataDisabled(this.isDisabled),
        disabled: this.isDisabled,
        [this.root.getBitsAttr("next-button")]: "",
        //
        onclick: this.#onclick,
    }));
}
export class CalendarPrevButtonState {
    root;
    id;
    ref;
    isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    #onclick = () => {
        if (this.isDisabled)
            return;
        this.root.prevPage();
    };
    props = $derived.by(() => ({
        id: this.id.current,
        role: "button",
        type: "button",
        "aria-label": "Previous",
        "aria-disabled": getAriaDisabled(this.isDisabled),
        "data-disabled": getDataDisabled(this.isDisabled),
        disabled: this.isDisabled,
        [this.root.getBitsAttr("prev-button")]: "",
        //
        onclick: this.#onclick,
    }));
}
export class CalendarGridState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        tabindex: -1,
        role: "grid",
        "aria-readonly": getAriaReadonly(this.root.readonly.current),
        "aria-disabled": getAriaDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        "data-disabled": getDataDisabled(this.root.disabled.current),
        [this.root.getBitsAttr("grid")]: "",
    }));
}
export class CalendarGridBodyState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("grid-body")]: "",
    }));
}
export class CalendarGridHeadState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("grid-head")]: "",
    }));
}
export class CalendarGridRowState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("grid-row")]: "",
    }));
}
export class CalendarHeadCellState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("head-cell")]: "",
    }));
}
export class CalendarHeaderState {
    root;
    id;
    ref;
    constructor(props, root) {
        this.root = root;
        this.id = props.id;
        this.ref = props.ref;
        useRefById({
            id: this.id,
            ref: this.ref,
        });
    }
    props = $derived.by(() => ({
        id: this.id.current,
        "data-disabled": getDataDisabled(this.root.disabled.current),
        "data-readonly": getDataReadonly(this.root.readonly.current),
        [this.root.getBitsAttr("header")]: "",
    }));
}
const [setCalendarRootContext, getCalendarRootContext] = createContext(["Calendar.Root", "RangeCalendar.Root"], "Calendar.Root", false);
const [setCalendarCellContext, getCalendarCellContext] = createContext("Calendar.Cell");
export function useCalendarRoot(props) {
    return setCalendarRootContext(new CalendarRootState(props));
}
export function useCalendarGrid(props) {
    const root = getCalendarRootContext();
    return new CalendarGridState(props, root);
}
export function useCalendarCell(props) {
    const root = getCalendarRootContext();
    return setCalendarCellContext(new CalendarCellState(props, root));
}
export function useCalendarNextButton(props) {
    const root = getCalendarRootContext();
    return new CalendarNextButtonState(props, root);
}
export function useCalendarPrevButton(props) {
    const root = getCalendarRootContext();
    return new CalendarPrevButtonState(props, root);
}
export function useCalendarDay(props) {
    const cell = getCalendarCellContext();
    return new CalendarDayState(props, cell);
}
export function useCalendarGridBody(props) {
    const root = getCalendarRootContext();
    return new CalendarGridBodyState(props, root);
}
export function useCalendarGridHead(props) {
    const root = getCalendarRootContext();
    return new CalendarGridHeadState(props, root);
}
export function useCalendarGridRow(props) {
    const root = getCalendarRootContext();
    return new CalendarGridRowState(props, root);
}
export function useCalendarHeadCell(props) {
    const root = getCalendarRootContext();
    return new CalendarHeadCellState(props, root);
}
export function useCalendarHeader(props) {
    const root = getCalendarRootContext();
    return new CalendarHeaderState(props, root);
}
export function useCalendarHeading(props) {
    const root = getCalendarRootContext();
    return new CalendarHeadingState(props, root);
}
