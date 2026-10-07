import { CalendarDate, getLocalTimeZone } from '@internationalized/date';
import { readDateInZone } from '#lib/utils/date';

export type DateCellType = 'date' | 'time' | 'date-time';

export const TYPE_DATE_FORMAT_DEFAULTS: Record<DateCellType, Intl.DateTimeFormatOptions> = {
	date: { day: '2-digit', month: '2-digit', year: 'numeric' },
	time: { hour: '2-digit', minute: '2-digit' },
	'date-time': {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	}
};

/**
 * The zone a date column is shown — and therefore filtered — in: `formatOptions.timeZone`
 * when the column sets one, otherwise the viewer's local zone.
 */
export function dateCellTimeZone(formatOptions: Intl.DateTimeFormatOptions | undefined): string {
	return formatOptions?.timeZone ?? getLocalTimeZone();
}

/**
 * A date cell value formatted for display, or undefined when it can't be read. Reads the
 * value with `readDateInZone`, exactly as the date range filter does, so a cell always shows
 * the day it is filtered by.
 */
export function formatDateCell(
	value: unknown,
	type: DateCellType,
	locale: string,
	formatOptions?: Intl.DateTimeFormatOptions
): string | undefined {
	const timeZone = dateCellTimeZone(formatOptions);
	const date = readDateInZone(value, timeZone);
	if (!date) return undefined;
	const options = { ...TYPE_DATE_FORMAT_DEFAULTS[type], ...formatOptions };
	// A calendar date has no instant: format its own year-month-day as UTC midnight in UTC,
	// so no display zone can move it to another day.
	if (date instanceof CalendarDate) {
		return new Intl.DateTimeFormat(locale, { ...options, timeZone: 'UTC' }).format(
			date.toDate('UTC')
		);
	}
	return new Intl.DateTimeFormat(locale, { ...options, timeZone }).format(date.toDate());
}
