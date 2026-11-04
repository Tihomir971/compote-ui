import { describe, expect, it } from 'vitest';
import { CalendarDate, HebrewCalendar, parseAbsolute } from '@internationalized/date';
import type { DataTableExportColumn } from '../export/export-data';
import { toXlsxCell, toXlsxDate, xlsxNumberFormat } from './xlsx-cell';

function column(overrides: Partial<DataTableExportColumn>): DataTableExportColumn {
	return {
		id: 'col',
		header: 'Col',
		hasCustomCell: false,
		hasExportValue: false,
		locale: 'en-US',
		size: 150,
		...overrides
	};
}

const cell = (value: unknown, text = String(value ?? '')) => ({ value, text });

describe('xlsxNumberFormat', () => {
	const number = column({ type: 'number' });

	it('shows the decimals Intl would, without a trailing point on whole numbers', () => {
		expect(xlsxNumberFormat(number, 1500)).toBe('#,##0');
		expect(xlsxNumberFormat(number, 1500.5)).toBe('#,##0.0');
		// number: {} shows up to 3 decimals.
		expect(xlsxNumberFormat(number, 1.23456)).toBe('#,##0.000');
	});

	it('rounds like Intl, not toFixed, at the last shown digit', () => {
		// Intl shows 1.001 and 1.01 here; toFixed would round both down.
		expect(xlsxNumberFormat(number, 1.0005)).toBe('#,##0.000');
		const two = column({ type: 'number', formatOptions: { maximumFractionDigits: 2 } });
		expect(xlsxNumberFormat(two, 1.005)).toBe('#,##0.00');
		// Rounding up to a whole number shows no decimals.
		expect(xlsxNumberFormat(two, 1.999)).toBe('#,##0');
	});

	it('keeps required decimals', () => {
		const col = column({
			type: 'number',
			formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 4 }
		});
		expect(xlsxNumberFormat(col, 1.5)).toBe('#,##0.00');
		expect(xlsxNumberFormat(col, 1.23456)).toBe('#,##0.0000');
	});

	it('formats percent and currency like the table defaults', () => {
		expect(xlsxNumberFormat(column({ type: 'percent' }), 0.745)).toBe('#,##0%');
		expect(xlsxNumberFormat(column({ type: 'currency' }), 299)).toBe('#,##0.00 "USD"');
		const yen = column({ type: 'currency', formatOptions: { currency: 'JPY' } });
		expect(xlsxNumberFormat(yen, 299)).toBe('#,##0 "JPY"');
	});

	it('drops grouping when Intl does', () => {
		const col = column({ type: 'number', formatOptions: { useGrouping: false } });
		expect(xlsxNumberFormat(col, 1500)).toBe('0');
	});

	it('gives up on options Excel formats cannot express', () => {
		expect(
			xlsxNumberFormat(column({ type: 'number', formatOptions: { notation: 'compact' } }), 1)
		).toBeUndefined();
		expect(
			xlsxNumberFormat(
				column({ type: 'number', formatOptions: { maximumSignificantDigits: 2 } }),
				1
			)
		).toBeUndefined();
		// Excel display rounding is half away from zero only.
		const floor = column({
			type: 'number',
			formatOptions: { maximumFractionDigits: 2, roundingMode: 'floor' }
		});
		expect(xlsxNumberFormat(floor, 1.239)).toBeUndefined();
		expect(toXlsxCell(floor, cell(1.239, '1.23'))).toEqual({ type: String, value: '1.23' });
	});
});

describe('toXlsxCell numbers', () => {
	const number = column({ type: 'number' });

	it('writes a number, also from a numeric string, as the table reads it', () => {
		expect(toXlsxCell(number, cell(1234.5))).toEqual({
			type: Number,
			value: 1234.5,
			format: '#,##0.0'
		});
		expect(toXlsxCell(number, cell('1234.56'))).toMatchObject({ type: Number, value: 1234.56 });
	});

	it('leaves empty values blank', () => {
		expect(toXlsxCell(number, cell(null))).toBeNull();
		expect(toXlsxCell(number, cell(''))).toBeNull();
	});

	it('falls back to the text for values that are not finite numbers', () => {
		expect(toXlsxCell(number, cell('abc', ''))).toBeNull();
		expect(toXlsxCell(number, cell(Infinity, '∞'))).toEqual({ type: String, value: '∞' });
	});

	it('falls back to the text when the format has no Excel equivalent', () => {
		const compact = column({ type: 'number', formatOptions: { notation: 'compact' } });
		expect(toXlsxCell(compact, cell(1500, '1.5K'))).toEqual({ type: String, value: '1.5K' });
	});
});

describe('toXlsxCell renderer and other types', () => {
	it('writes the text of a column with its own cell renderer', () => {
		const col = column({ type: 'number', hasCustomCell: true });
		expect(toXlsxCell(col, cell(3, 'three'))).toEqual({ type: String, value: 'three' });
	});

	it('writes exportValue typed even when the column has a cell renderer', () => {
		const col = column({ type: 'number', hasCustomCell: true, hasExportValue: true });
		expect(toXlsxCell(col, cell(3, 'three'))).toMatchObject({ type: Number, value: 3 });
	});

	it('writes only real booleans as booleans, like the table shows them', () => {
		const col = column({ type: 'boolean' });
		expect(toXlsxCell(col, cell(true, 'Yes'))).toEqual({ type: Boolean, value: true });
		expect(toXlsxCell(col, cell(false, 'No'))).toEqual({ type: Boolean, value: false });
		// The table shows `-` for these.
		expect(toXlsxCell(col, cell(0, ''))).toBeNull();
		expect(toXlsxCell(col, cell('false', ''))).toBeNull();
		expect(toXlsxCell(col, cell(null))).toBeNull();
	});

	it('writes text columns as strings, without a formula guard', () => {
		const col = column({ type: 'text' });
		expect(toXlsxCell(col, cell('=1+1'))).toEqual({ type: String, value: '=1+1' });
		expect(toXlsxCell(col, cell(undefined, ''))).toBeNull();
	});
});

describe('toXlsxCell dates', () => {
	it('keeps the day the table shows in the column zone, around midnight', () => {
		const col = column({ type: 'date-time', formatOptions: { timeZone: 'Europe/Belgrade' } });
		const result = toXlsxCell(col, cell('2024-03-15T23:30:00Z'));
		expect(result).toMatchObject({ type: Date, format: 'dd.mm.yyyy hh:mm' });
		expect((result as { value: Date }).value.toISOString()).toBe('2024-03-16T00:30:00.000Z');
	});

	it('drops the time of a date column, on the day shown in its zone', () => {
		const col = column({ type: 'date', formatOptions: { timeZone: 'Europe/Belgrade' } });
		const result = toXlsxCell(col, cell('2024-03-15T23:30:00Z'));
		expect((result as { value: Date }).value.toISOString()).toBe('2024-03-16T00:00:00.000Z');
	});

	it('keeps only the time of day of a time column', () => {
		const col = column({ type: 'time', formatOptions: { timeZone: 'Europe/Belgrade' } });
		const result = toXlsxCell(col, cell('2024-03-15T08:30:00Z'));
		expect(result).toMatchObject({ type: Date, format: 'hh:mm' });
		expect((result as { value: Date }).value.toISOString()).toBe('1899-12-30T09:30:00.000Z');
	});

	it('writes a date-only value as that day', () => {
		const result = toXlsxCell(column({ type: 'date' }), cell('2024-03-15'));
		expect((result as { value: Date }).value.toISOString()).toBe('2024-03-15T00:00:00.000Z');
	});

	it('uses the given formats', () => {
		const formats = { date: 'yyyy-mm-dd', time: 'hh:mm:ss', dateTime: 'yyyy-mm-dd hh:mm' };
		expect(toXlsxCell(column({ type: 'time' }), cell('2024-03-15'), formats)).toMatchObject({
			format: 'hh:mm:ss'
		});
	});

	it('falls back to the text for an unreadable date', () => {
		expect(toXlsxCell(column({ type: 'date' }), cell('soon'))).toEqual({
			type: String,
			value: 'soon'
		});
	});
});

describe('toXlsxDate', () => {
	it('keeps years 0–99', () => {
		expect(toXlsxDate(new CalendarDate(50, 1, 2)).getUTCFullYear()).toBe(50);
	});

	it('converts other calendars to the Gregorian day', () => {
		const hebrew = new CalendarDate(new HebrewCalendar(), 5787, 1, 1);
		expect(toXlsxDate(hebrew).toISOString()).toBe('2026-09-12T00:00:00.000Z');
	});

	it('writes the wall clock of a zoned date', () => {
		const zoned = parseAbsolute('2024-07-01T22:15:30.250Z', 'America/New_York');
		expect(toXlsxDate(zoned).toISOString()).toBe('2024-07-01T18:15:30.250Z');
		expect(toXlsxDate(zoned, 'date').toISOString()).toBe('2024-07-01T00:00:00.000Z');
		expect(toXlsxDate(zoned, 'time').toISOString()).toBe('1899-12-30T18:15:30.250Z');
	});
});
