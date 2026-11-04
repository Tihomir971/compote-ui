import { GregorianCalendar, toCalendar } from '@internationalized/date';
import { readDateInZone, type ZonedOrCalendarDate } from '../../../utils/date';
import { dateCellTimeZone } from '../date-cell';
import { TYPE_NUMBER_FORMAT_DEFAULTS } from '../data-table-utils';
import type { DataTableExportCell, DataTableExportColumn } from '../export/export-data';

/** Excel number formats for date columns. */
export type XlsxDateFormats = {
	date: string;
	time: string;
	dateTime: string;
};

export const DEFAULT_XLSX_DATE_FORMATS: XlsxDateFormats = {
	date: 'dd.mm.yyyy',
	time: 'hh:mm',
	dateTime: 'dd.mm.yyyy hh:mm'
};

/**
 * One sheet cell, in the shape `write-excel-file` takes. Declared here so the published types
 * don't depend on the optional peer.
 */
export type XlsxCell =
	| null
	| { type: StringConstructor; value: string; fontWeight?: 'bold' }
	| { type: NumberConstructor; value: number; format: string }
	| { type: DateConstructor; value: Date; format: string }
	| { type: BooleanConstructor; value: boolean };

const NUMBER_TYPES = new Set(['number', 'currency', 'percent']);
const DATE_TYPES = new Set(['date', 'time', 'date-time']);

const isEmpty = (value: unknown) => value === null || value === undefined || value === '';

function textCell(cell: DataTableExportCell): XlsxCell {
	return cell.text === '' ? null : { type: String, value: cell.text };
}

/**
 * The Excel format string matching how the table shows `value`, or undefined when the
 * column's Intl options have no faithful Excel equivalent (the cell is then written as text).
 * Decimals are chosen per value, exactly as many as Intl shows (read from `formatToParts`, so
 * Intl's own rounding decides): `#,##0.###` would leave a trailing `.` on whole numbers.
 */
export function xlsxNumberFormat(column: DataTableExportColumn, value: number): string | undefined {
	const defaults = column.type ? TYPE_NUMBER_FORMAT_DEFAULTS[column.type] : undefined;
	let formatter: Intl.NumberFormat;
	try {
		formatter = new Intl.NumberFormat(column.locale, {
			...defaults,
			...(column.formatOptions as Intl.NumberFormatOptions | undefined)
		});
	} catch {
		return undefined;
	}
	const resolved = formatter.resolvedOptions();

	const unsupported =
		resolved.notation !== 'standard' ||
		resolved.minimumSignificantDigits !== undefined ||
		resolved.maximumSignificantDigits !== undefined ||
		resolved.signDisplay !== 'auto' ||
		resolved.minimumIntegerDigits !== 1 ||
		(resolved.roundingIncrement ?? 1) !== 1 ||
		// Excel display rounds half away from zero, which is Intl's `halfExpand` only.
		(resolved.roundingMode ?? 'halfExpand') !== 'halfExpand' ||
		resolved.style === 'unit' ||
		(resolved.style === 'currency' &&
			(resolved.currencyDisplay === 'name' || resolved.currencySign === 'accounting'));
	if (unsupported) return undefined;

	const fraction = formatter.formatToParts(value).find((part) => part.type === 'fraction');
	const decimals = fraction?.value.length ?? 0;

	const grouping = resolved.useGrouping === false ? '0' : '#,##0';
	const format = decimals > 0 ? `${grouping}.${'0'.repeat(decimals)}` : grouping;
	if (resolved.style === 'percent') return `${format}%`;
	if (resolved.style === 'currency') return `${format} "${resolved.currency}"`;
	return format;
}

/** Which part of a date a column shows, and so which part Excel gets. */
export type XlsxDatePart = 'date' | 'time' | 'date-time';

/**
 * The date as Excel should show it. Excel dates have no zone, and `write-excel-file` reads a
 * `Date` in UTC, so the wall clock of the zone the table shows is written as UTC. A `date`
 * column drops the time (midnight); a `time` column keeps only the time of day, on Excel's day
 * zero (1899-12-30), so times sort and compare by time alone.
 */
export function toXlsxDate(date: ZonedOrCalendarDate, part: XlsxDatePart = 'date-time'): Date {
	const gregorian = toCalendar(date, new GregorianCalendar());
	const year = gregorian.era === 'BC' ? 1 - gregorian.year : gregorian.year;
	const result = new Date(0);
	// Not Date.UTC: it reads years 0–99 as 1900–1999.
	if (part === 'time') result.setUTCFullYear(1899, 11, 30);
	else result.setUTCFullYear(year, gregorian.month - 1, gregorian.day);
	if (part !== 'date' && 'hour' in gregorian) {
		result.setUTCHours(gregorian.hour, gregorian.minute, gregorian.second, gregorian.millisecond);
	}
	return result;
}

function dateFormatFor(type: DataTableExportColumn['type'], formats: XlsxDateFormats) {
	if (type === 'time') return formats.time;
	if (type === 'date-time') return formats.dateTime;
	return formats.date;
}

/**
 * One export cell as a typed sheet cell: numbers, dates and booleans stay computable in Excel;
 * everything else — and any column with its own `cell` renderer but no `exportValue` — is the
 * text the table shows. Typed cells can't hold formulas, so no `'` guard is needed.
 */
export function toXlsxCell(
	column: DataTableExportColumn,
	cell: DataTableExportCell,
	formats: XlsxDateFormats = DEFAULT_XLSX_DATE_FORMATS
): XlsxCell {
	const { type } = column;
	if (column.hasCustomCell && !column.hasExportValue) return textCell(cell);
	if (type === undefined) return textCell(cell);

	if (NUMBER_TYPES.has(type)) {
		if (isEmpty(cell.value)) return null;
		const value = Number(cell.value);
		if (!Number.isFinite(value)) return textCell(cell);
		const format = xlsxNumberFormat(column, value);
		return format === undefined ? textCell(cell) : { type: Number, value, format };
	}

	if (DATE_TYPES.has(type)) {
		if (isEmpty(cell.value)) return null;
		const formatOptions = column.formatOptions as Intl.DateTimeFormatOptions | undefined;
		const date = readDateInZone(cell.value, dateCellTimeZone(formatOptions));
		if (!date) return textCell(cell);
		return {
			type: Date,
			value: toXlsxDate(date, type as XlsxDatePart),
			format: dateFormatFor(type, formats)
		};
	}

	if (type === 'boolean') {
		// Like the table, only a real true/false is a checkbox; anything else shows `-`.
		return typeof cell.value === 'boolean' ? { type: Boolean, value: cell.value } : null;
	}

	return textCell(cell);
}
