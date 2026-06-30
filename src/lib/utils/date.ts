import {
	parseDate,
	parseDateTime,
	parseAbsolute,
	parseAbsoluteToLocal,
	fromDate,
	getLocalTimeZone,
	type DateValue,
	type ZonedDateTime
} from '@internationalized/date';

export type { DateValue };

/**
 * Anything the date components accept for a single value: an
 * `@internationalized/date` value, an ISO/DB string, a native `Date`, or null.
 */
export type DateInputValue = DateValue | string | Date | null | undefined;

/** The runtime shape a bound value was provided in, used to round-trip on change. */
export type DateValueShape = 'string' | 'date' | 'date-value';

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
// Trailing `Z`, or a `+HH`, `+HH:MM`, `+HHMM` offset.
const HAS_OFFSET = /(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

/** Normalize a DB datetime string to ISO 8601: space → `T`, bare `+HH` offset → `+HH:00`. */
function normalizeIso(value: string): string {
	return value.replace(' ', 'T').replace(/([+-]\d{2})$/, '$1:00');
}

/** Report the runtime shape of a value so a change can be emitted in the same shape. */
export function dateValueShape(value: DateInputValue): DateValueShape | null {
	if (value == null) return null;
	if (typeof value === 'string') return 'string';
	if (value instanceof Date) return 'date';
	return 'date-value';
}

/**
 * Coerce a string / `Date` / `DateValue` into a `DateValue` for Ark UI.
 *
 * String auto-detection:
 * - `"2024-01-15"` → {@link parseDate} (date-only)
 * - `"2024-01-15T10:30:00"` → {@link parseDateTime} (local datetime)
 * - `"2024-01-15T10:30:00Z"` / `"…+02:00"` → zoned (in `timeZone`, else local)
 */
export function toDateValue(value: DateInputValue, timeZone?: string): DateValue | null {
	if (value == null) return null;
	if (value instanceof Date) return fromDate(value, timeZone ?? getLocalTimeZone());
	if (typeof value !== 'string') return value;

	const raw = value.trim();
	if (!raw) return null;
	if (DATE_ONLY.test(raw)) return parseDate(raw);

	const iso = normalizeIso(raw);
	if (HAS_OFFSET.test(iso)) {
		return timeZone ? parseAbsolute(iso, timeZone) : parseAbsoluteToLocal(iso);
	}
	return parseDateTime(iso);
}

/** Serialize a `DateValue` to an ISO string (absolute `…Z` for zoned values). */
export function dateValueToString(value: DateValue): string {
	return 'timeZone' in value ? (value as ZonedDateTime).toAbsoluteString() : value.toString();
}

/** Convert a `DateValue` to a native `Date`. */
export function dateValueToDate(value: DateValue, timeZone?: string): Date {
	return 'timeZone' in value
		? (value as ZonedDateTime).toDate()
		: value.toDate(timeZone ?? getLocalTimeZone());
}

/** Emit a `DateValue` back in the original `shape` it was bound as. */
export function fromDateValue(
	value: DateValue | null,
	shape: DateValueShape,
	timeZone?: string
): DateValue | string | Date | null {
	if (value == null) return null;
	if (shape === 'string') return dateValueToString(value);
	if (shape === 'date') return dateValueToDate(value, timeZone);
	return value;
}
