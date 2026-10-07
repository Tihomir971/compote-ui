/**
 * Calendar-day range filters for date and date-time columns.
 *
 * The filter value is `[from?, to?]`, each an ISO calendar date (`YYYY-MM-DD`) or empty — no
 * time, no zone, so it serializes cleanly. Both bounds are inclusive days. A cell matches
 * when the day it shows in the display zone (see `readDateInZone`) falls inside the range.
 * For an instant that is the half-open interval [start of `from`, start of the day after
 * `to`) in that zone, with day starts taken from the calendar — so 23- and 25-hour DST days
 * need no special handling.
 */
import { CalendarDate, parseDate, toCalendarDate } from '@internationalized/date';
import { readDateInZone } from './date';

/** A date range filter value as stored in table state. */
export type DateRangeFilterValue = [from?: string, to?: string];

/** A filter value read into calendar dates; an absent bound leaves that end open. */
export type DateRange = { from?: CalendarDate; to?: CalendarDate };

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** A bound as a calendar date; anything but a valid `YYYY-MM-DD` reads as no bound. */
function readBound(value: unknown): CalendarDate | undefined {
	if (typeof value !== 'string' || !DATE_ONLY.test(value)) return undefined;
	try {
		return parseDate(value);
	} catch {
		return undefined;
	}
}

/**
 * The range a filter value stands for. Invalid bounds are dropped and a reversed range is
 * swapped (as TanStack's `inNumberRange` does). Always returns a range — never undefined —
 * because the table falls back to the raw value when `resolveFilterValue` returns nullish.
 */
export function resolveDateRange(filterValue: unknown): DateRange {
	if (!Array.isArray(filterValue)) return {};
	const from = readBound(filterValue[0]);
	const to = readBound(filterValue[1]);
	if (from && to && from.compare(to) > 0) return { from: to, to: from };
	return { from, to };
}

/** Whether a filter value has no usable bound, so the filter should be removed. */
export function isEmptyDateRange(filterValue: unknown): boolean {
	const { from, to } = resolveDateRange(filterValue);
	return !from && !to;
}

/**
 * Whether a cell value falls in `range`, judged by the calendar day it shows in `timeZone`.
 * Empty or unparseable cell values never match while the filter is active.
 */
export function matchesDateRange(value: unknown, range: DateRange, timeZone: string): boolean {
	const date = readDateInZone(value, timeZone);
	if (!date) return false;
	const day = date instanceof CalendarDate ? date : toCalendarDate(date);
	if (range.from && day.compare(range.from) < 0) return false;
	if (range.to && day.compare(range.to) > 0) return false;
	return true;
}
