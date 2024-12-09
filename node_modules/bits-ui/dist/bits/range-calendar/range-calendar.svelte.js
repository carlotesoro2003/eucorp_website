import { getLocalTimeZone, isSameDay, isSameMonth, isToday, } from "@internationalized/date";
import { untrack } from "svelte";
import { useRefById } from "svelte-toolbelt";
import { useId } from "../../internal/use-id.js";
import { getAriaDisabled, getAriaSelected, getDataDisabled, getDataSelected, getDataUnavailable, } from "../../internal/attrs.js";
import { createContext } from "../../internal/create-context.js";
import { getAnnouncer } from "../../internal/date-time/announcer.js";
import { createFormatter } from "../../internal/date-time/formatter.js";
import { createMonths, getCalendarElementProps, getCalendarHeadingValue, getIsNextButtonDisabled, getIsPrevButtonDisabled, getWeekdays, handleCalendarKeydown, handleCalendarNextPage, handleCalendarPrevPage, shiftCalendarFocus, useMonthViewOptionsSync, useMonthViewPlaceholderSync, } from "../../internal/date-time/calendar-helpers.svelte.js";
import { areAllDaysBetweenValid, isAfter, isBefore, isBetweenInclusive, toDate, } from "../../internal/date-time/utils.js";
export class RangeCalendarRootState {
    id;
    ref;
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
    readonly;
    disableDaysOutsideMonth;
    onRangeSelect;
    startValue;
    endValue;
    months = $state([]);
    visibleMonths = $derived.by(() => this.months.map((month) => month.value));
    announcer;
    formatter;
    accessibleHeadingId = useId();
    focusedValue = $state(undefined);
    lastPressedDateValue = $state(undefined);
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
        this.readonly = props.readonly;
        this.disableDaysOutsideMonth = props.disableDaysOutsideMonth;
        this.id = props.id;
        this.ref = props.ref;
        this.onRangeSelect = props.onRangeSelect;
        this.startValue = props.startValue;
        this.endValue = props.endValue;
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
            if (this.formatter.getLocale() === this.locale.current)
                return;
            this.formatter.setLocale(this.locale.current);
        });
        /**
         * Updates the displayed months based on changes in the placeholder values,
         * which determines the month to show in the calendar.
         */
        useMonthViewPlaceholderSync({
            placeholder: this.placeholder,
            getVisibleMonths: () => this.visibleMonths,
            weekStartsOn: this.weekStartsOn,
            locale: this.locale,
            fixedWeeks: this.fixedWeeks,
            numberOfMonths: this.numberOfMonths,
            setMonths: this.#setMonths,
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
         * Synchronize the start and end values with the `value` in case
         * it is updated externally.
         */
        $effect(() => {
            const value = this.value.current;
            untrack(() => {
                if (value.start && value.end) {
                    this.startValue.current = value.start;
                    this.endValue.current = value.end;
                }
                else if (value.start) {
                    this.startValue.current = value.start;
                    this.endValue.current = undefined;
                }
            });
        });
        /**
         * Synchronize the placeholder value with the current start value
         */
        $effect(() => {
            this.value.current;
            untrack(() => {
                const startValue = this.value.current.start;
                if (startValue && this.placeholder.current !== startValue) {
                    this.placeholder.current = startValue;
                }
            });
        });
        $effect(() => {
            const startValue = this.startValue.current;
            const endValue = this.endValue.current;
            untrack(() => {
                const value = this.value.current;
                if (value && value.start === startValue && value.end === endValue) {
                    return;
                }
                if (startValue && endValue) {
                    this.#updateValue((prev) => {
                        if (prev.start === startValue && prev.end === endValue)
                            return prev;
                        if (isBefore(endValue, startValue)) {
                            const start = startValue;
                            const end = endValue;
                            this.setStartValue(end);
                            this.setEndValue(start);
                            return { start: endValue, end: startValue };
                        }
                        else {
                            return {
                                start: startValue,
                                end: endValue,
                            };
                        }
                    });
                }
                else if (value && value.start && value.end) {
                    this.value.current = {
                        start: undefined,
                        end: undefined,
                    };
                }
            });
        });
    }
    #updateValue = (cb) => {
        const value = this.value.current;
        const newValue = cb(value);
        this.value.current = newValue;
        if (newValue.start && newValue.end) {
            this.onRangeSelect?.current?.();
        }
    };
    setStartValue = (value) => {
        this.startValue.current = value;
    };
    setEndValue = (value) => {
        this.endValue.current = value;
    };
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
        if (maxValue && isAfter(date, maxValue))
            return true;
        return false;
    };
    isDateUnavailable = (date) => {
        if (this.isDateUnavailableProp.current(date))
            return true;
        return false;
    };
    isStartInvalid = $derived.by(() => {
        if (!this.startValue.current)
            return false;
        return (this.isDateUnavailable(this.startValue.current) ||
            this.isDateDisabled(this.startValue.current));
    });
    isEndInvalid = $derived.by(() => {
        if (!this.endValue.current)
            return false;
        return (this.isDateUnavailable(this.endValue.current) ||
            this.isDateDisabled(this.endValue.current));
    });
    isInvalid = $derived.by(() => {
        if (this.isStartInvalid || this.isEndInvalid)
            return true;
        if (this.endValue.current &&
            this.startValue.current &&
            isBefore(this.endValue.current, this.startValue.current))
            return true;
        return false;
    });
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
    headingValue = $derived.by(() => {
        return getCalendarHeadingValue({
            months: this.months,
            formatter: this.formatter,
            locale: this.locale.current,
        });
    });
    fullCalendarLabel = $derived.by(() => `${this.calendarLabel.current} ${this.headingValue}`);
    isSelectionStart = (date) => {
        if (!this.startValue.current)
            return false;
        return isSameDay(date, this.startValue.current);
    };
    isSelectionEnd = (date) => {
        if (!this.endValue.current)
            return false;
        return isSameDay(date, this.endValue.current);
    };
    isSelected = (date) => {
        if (this.startValue.current && isSameDay(this.startValue.current, date))
            return true;
        if (this.endValue.current && isSameDay(this.endValue.current, date))
            return true;
        if (this.startValue.current && this.endValue.current) {
            return isBetweenInclusive(date, this.startValue.current, this.endValue.current);
        }
        return false;
    };
    highlightedRange = $derived.by(() => {
        if (this.startValue.current && this.endValue.current)
            return null;
        if (!this.startValue.current || !this.focusedValue)
            return null;
        const isStartBeforeFocused = isBefore(this.startValue.current, this.focusedValue);
        const start = isStartBeforeFocused ? this.startValue.current : this.focusedValue;
        const end = isStartBeforeFocused ? this.focusedValue : this.startValue.current;
        if (isSameDay(start.add({ days: 1 }), end)) {
            return {
                start,
                end,
            };
        }
        const isValid = areAllDaysBetweenValid(start, end, this.isDateUnavailable, this.isDateDisabled);
        if (isValid) {
            return {
                start,
                end,
            };
        }
        return null;
    });
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
    #announceEmpty = () => {
        this.announcer.announce("Selected date is now empty.", "polite");
    };
    #announceSelectedDate = (date) => {
        this.announcer.announce(`Selected Date: ${this.formatter.selectedDate(date, false)}`, "polite");
    };
    #announceSelectedRange = (start, end) => {
        this.announcer.announce(`Selected Dates: ${this.formatter.selectedDate(start, false)} to ${this.formatter.selectedDate(end, false)}`, "polite");
    };
    handleCellClick = (e, date) => {
        if (this.isDateDisabled(date) || this.isDateUnavailable(date))
            return;
        const prevLastPressedDate = this.lastPressedDateValue;
        this.lastPressedDateValue = date;
        if (this.startValue.current && this.highlightedRange === null) {
            if (isSameDay(this.startValue.current, date) &&
                !this.preventDeselect.current &&
                !this.endValue.current) {
                this.setStartValue(undefined);
                this.placeholder.current = date;
                this.#announceEmpty();
                return;
            }
            else if (!this.endValue.current) {
                e.preventDefault();
                if (prevLastPressedDate && isSameDay(prevLastPressedDate, date)) {
                    this.setStartValue(date);
                    this.#announceSelectedDate(date);
                }
            }
        }
        if (this.startValue.current &&
            this.endValue.current &&
            isSameDay(this.endValue.current, date) &&
            !this.preventDeselect.current) {
            this.setStartValue(undefined);
            this.setEndValue(undefined);
            this.placeholder.current = date;
            this.#announceEmpty();
            return;
        }
        if (!this.startValue.current) {
            this.#announceSelectedDate(date);
            this.setStartValue(date);
        }
        else if (!this.endValue.current) {
            this.#announceSelectedRange(this.startValue.current, date);
            this.setEndValue(date);
        }
        else if (this.endValue.current && this.startValue.current) {
            this.setEndValue(undefined);
            this.#announceSelectedDate(date);
            this.setStartValue(date);
        }
    };
    #onkeydown = (event) => {
        return handleCalendarKeydown({
            event,
            handleCellClick: this.handleCellClick,
            placeholderValue: this.placeholder.current,
            shiftFocus: this.#shiftFocus,
        });
    };
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
    getBitsAttr = (part) => {
        return `data-range-calendar-${part}`;
    };
    snippetProps = $derived.by(() => ({
        months: this.months,
        weekdays: this.weekdays,
    }));
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
export class RangeCalendarCellState {
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
    isSelectedDate = $derived.by(() => this.root.isSelected(this.date.current));
    isSelectionStart = $derived.by(() => this.root.isSelectionStart(this.date.current));
    isSelectionEnd = $derived.by(() => this.root.isSelectionEnd(this.date.current));
    isHighlighted = $derived.by(() => this.root.highlightedRange
        ? isBetweenInclusive(this.date.current, this.root.highlightedRange.start, this.root.highlightedRange.end)
        : false);
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
        "data-selection-start": this.isSelectionStart ? "" : undefined,
        "data-selection-end": this.isSelectionEnd ? "" : undefined,
        "data-highlighted": this.isHighlighted ? "" : undefined,
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
class RangeCalendarDayState {
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
    #onmouseenter = () => {
        if (this.cell.isDisabled)
            return;
        this.cell.root.focusedValue = this.cell.date.current;
    };
    #onfocusin = () => {
        if (this.cell.isDisabled)
            return;
        this.cell.root.focusedValue = this.cell.date.current;
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
        onmouseenter: this.#onmouseenter,
        onfocusin: this.#onfocusin,
    }));
}
const [setRangeCalendarRootContext, getRangeCalendarRootContext] = createContext(["Calendar.Root", "RangeCalendar.Root"], "Calendar.Root", false);
const [setRangeCalendarCellContext, getRangeCalendarCellContext] = createContext("RangeCalendar.Cell");
export function useRangeCalendarRoot(props) {
    return setRangeCalendarRootContext(new RangeCalendarRootState(props));
}
export function useRangeCalendarCell(props) {
    return setRangeCalendarCellContext(new RangeCalendarCellState(props, getRangeCalendarRootContext()));
}
export function useRangeCalendarDay(props) {
    return new RangeCalendarDayState(props, getRangeCalendarCellContext());
}
