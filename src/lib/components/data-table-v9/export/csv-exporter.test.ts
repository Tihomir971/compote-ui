import { describe, expect, it } from 'vitest';
import { exportDataToCsvRows, guardCsvFormula } from './csv-exporter';
import type { DataTableExportColumn, DataTableExportData } from './export-data';

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

function data(
	col: DataTableExportColumn,
	text: string,
	value: unknown = text
): DataTableExportData {
	return { columns: [col], rows: [[{ value, text }]] };
}

describe('guardCsvFormula', () => {
	it.each(['=SUM(A1:A2)', '=1+1', '+cmd|x', '-2+HYPERLINK("x")', '@cmd', '\t1', '\rx'])(
		'prefixes %j',
		(text) => {
			expect(guardCsvFormula(text)).toBe(`'${text}`);
		}
	);

	it.each(['+381 60 1234567', '-5', '-1.234,56', '+1 (201) 555-0123'])(
		'leaves numeric-looking %j alone',
		(text) => {
			expect(guardCsvFormula(text)).toBe(text);
		}
	);

	it('leaves other text alone', () => {
		expect(guardCsvFormula('Ada')).toBe('Ada');
		expect(guardCsvFormula('')).toBe('');
	});
});

describe('exportDataToCsvRows', () => {
	it('writes the header row first', () => {
		const rows = exportDataToCsvRows(data(column({ header: 'Name' }), 'Ada'));
		expect(rows).toEqual([['Name'], ['Ada']]);
	});

	it('guards text columns against formulas', () => {
		const rows = exportDataToCsvRows(data(column({ type: 'text' }), '=HYPERLINK("x")'));
		expect(rows[1]).toEqual([`'=HYPERLINK("x")`]);
	});

	it('keeps the sign of a formatted number in a number column', () => {
		const rows = exportDataToCsvRows(data(column({ type: 'currency' }), '-$5.00', -5));
		expect(rows[1]).toEqual(['-$5.00']);
	});

	it('guards a number column whose own cell renderer returns text', () => {
		const col = column({ type: 'number', hasCustomCell: true });
		const rows = exportDataToCsvRows(data(col, '=HYPERLINK("x")', 42));
		expect(rows[1]).toEqual([`'=HYPERLINK("x")`]);
	});

	it('guards headers too', () => {
		const rows = exportDataToCsvRows(data(column({ header: '=X' }), 'a'));
		expect(rows[0]).toEqual([`'=X`]);
	});
});
