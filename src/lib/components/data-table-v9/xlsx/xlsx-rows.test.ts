import { describe, expect, it } from 'vitest';
import { strFromU8, unzipSync } from 'fflate';
import {
	exportRowsToXlsxBlob,
	rowsToExportData,
	type XlsxExporterOptions,
	type XlsxRowsColumn
} from './index';

type Rows = Record<string, unknown>[];

/** Writes a real .xlsx and returns its XML parts, with helpers to read one cell back. */
async function writeXlsx(
	rows: Rows,
	columns: XlsxRowsColumn[],
	options: XlsxExporterOptions & { locale?: string } = {}
) {
	const blob = await exportRowsToXlsxBlob(rows, columns, options);
	const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
	const read = (path: string) => {
		const file = files[path];
		if (!file) throw new Error(`missing ${path}`);
		return strFromU8(file);
	};
	const sheet = read('xl/worksheets/sheet1.xml');
	const styles = read('xl/styles.xml');
	const workbook = read('xl/workbook.xml');
	const strings = [...read('xl/sharedStrings.xml').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((si) =>
		[...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join('')
	);

	const cellXfs = /<cellXfs[^>]*>([\s\S]*?)<\/cellXfs>/.exec(styles)?.[1] ?? '';
	const xfs = [...cellXfs.matchAll(/<xf\b[^>]*>/g)].map((xf) => xf[0]);
	const fonts = [...styles.matchAll(/<font>([\s\S]*?)<\/font>/g)].map((font) => font[1]);

	/** A cell as Excel would read it: type, value, the text behind a shared string, format, bold. */
	function cell(ref: string) {
		const xml = new RegExp(`<c r="${ref}"[^>]*?(?:/>|>[\\s\\S]*?</c>)`).exec(sheet)?.[0];
		if (!xml) return undefined;
		const type = / t="(\w+)"/.exec(xml)?.[1];
		const value = /<v>([^<]*)<\/v>/.exec(xml)?.[1];
		const xf = xfs[Number(/ s="(\d+)"/.exec(xml)?.[1] ?? 0)] ?? '';
		const numFmtId = /numFmtId="(\d+)"/.exec(xf)?.[1];
		const formatCode = numFmtId
			? new RegExp(`<numFmt numFmtId="${numFmtId}" formatCode="([^"]*)"`)
					.exec(styles)?.[1]
					?.replaceAll('&quot;', '"')
			: undefined;
		const fontId = Number(/fontId="(\d+)"/.exec(xf)?.[1] ?? 0);
		return {
			type,
			value,
			text: type === 's' ? strings[Number(value)] : undefined,
			formatCode,
			bold: fonts[fontId]?.includes('<b/>') ?? false
		};
	}

	return { sheet, workbook, cell };
}

const columns: XlsxRowsColumn[] = [
	{ key: 'sku', header: 'SKU' },
	{
		key: 'qty',
		header: 'Qty',
		type: 'number',
		formatOptions: { useGrouping: false, maximumFractionDigits: 0 }
	},
	{
		key: 'price',
		header: 'Price',
		type: 'number',
		formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
	},
	{ key: 'note' }
];

const rows: Rows = [
	{ sku: '00123', qty: 12000, price: 1234.5, note: 'Čokolada mlečna, 100 g' },
	{ sku: '9', qty: 1, price: null, note: undefined },
	{ sku: '', qty: null, price: 2, note: '' }
];

describe('rowsToExportData', () => {
	it('maps keys to columns and values to cells, with the text a table would show', () => {
		const data = rowsToExportData(rows, columns);
		expect(data.columns.map((c) => [c.id, c.header, c.type])).toEqual([
			['sku', 'SKU', undefined],
			['qty', 'Qty', 'number'],
			['price', 'Price', 'number'],
			['note', 'note', undefined]
		]);
		expect(data.rows[0].map((cell) => cell.text)).toEqual([
			'00123',
			'12000',
			'1,234.50',
			'Čokolada mlečna, 100 g'
		]);
		// Empty values (null, undefined, '') have no text.
		expect(data.rows[1].map((cell) => cell.text)).toEqual(['9', '1', '', '']);
		expect(data.rows[2].map((cell) => cell.text)).toEqual(['', '', '2.00', '']);
	});

	it('formats text for the given locale', () => {
		const data = rowsToExportData([{ price: 1234.5 }], [{ key: 'price', type: 'number' }], 'sr-RS');
		expect(data.rows[0][0].text).toBe('1.234,5');
	});

	it('reads values the way the table does: numeric strings, dates in any form, booleans', () => {
		const data = rowsToExportData(
			[
				{ n: '1234567.5', d: new Date('2026-11-04T13:45:00Z'), b: true },
				{ n: 'abc', d: '2026-11-04T13:45:00Z', b: false },
				{ n: NaN, d: 'not a date', b: 'yes' }
			],
			[
				{
					key: 'n',
					type: 'number',
					formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
				},
				{ key: 'd', type: 'date-time', formatOptions: { timeZone: 'UTC' } },
				{ key: 'b', type: 'boolean' }
			]
		);
		const texts = (index: number) => data.rows.map((row) => row[index].text);
		expect(texts(0)).toEqual(['1,234,567.50', '', '']);
		// A Date and its ISO string give the same text, formatted, not the raw string.
		expect(texts(1)[0]).toBe(texts(1)[1]);
		expect(texts(1)[0]).not.toContain('2026-11-04T');
		expect(texts(1)[2]).toBe('');
		expect(texts(2)).toEqual(['Yes', 'No', 'Yes']);
	});
});

describe('exportRowsToXlsxBlob', () => {
	it('writes numbers as numbers with their format and text columns as text', async () => {
		const { cell } = await writeXlsx(rows, columns);
		// '00123' is a text cell (a shared string), so its zeros stay.
		expect(cell('A2')).toMatchObject({ type: 's', text: '00123' });
		expect(cell('B2')).toMatchObject({ type: undefined, value: '12000', formatCode: '0' });
		expect(cell('C2')).toMatchObject({ type: undefined, value: '1234.5', formatCode: '#,##0.00' });
		expect(cell('D2')).toMatchObject({ type: 's', text: 'Čokolada mlečna, 100 g' });
	});

	it('leaves empty cells out', async () => {
		const { cell } = await writeXlsx(rows, columns);
		expect(cell('C3')).toBeUndefined();
		expect(cell('D3')).toBeUndefined();
		expect(cell('A4')).toBeUndefined();
		expect(cell('B4')).toBeUndefined();
		expect(cell('D4')).toBeUndefined();
	});

	it('bolds the header cells only', async () => {
		const { cell } = await writeXlsx(rows, columns);
		for (const ref of ['A1', 'B1', 'C1', 'D1']) expect(cell(ref)?.bold).toBe(true);
		for (const ref of ['A2', 'B2', 'C2', 'D2']) expect(cell(ref)?.bold).toBe(false);
		// The header text is the column header, or the key when there is none.
		expect(cell('A1')?.text).toBe('SKU');
		expect(cell('D1')?.text).toBe('note');
	});

	it('freezes the header row, fits widths to the content and names the sheet', async () => {
		const { sheet, workbook } = await writeXlsx(rows, columns, { sheet: 'Cart Items' });
		expect(sheet).toContain('ySplit="1"');
		// SKU: min 8; Qty: "12000" + 1 -> min 8; Price: "1,234.50" + 1; note: 22 chars + 1.
		const widths = [...sheet.matchAll(/<col [^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
		expect(widths).toEqual([8, 8, 9, 23]);
		expect(workbook).toContain('name="Cart Items"');
	});

	it('writes a Date and an ISO string as the same Excel date, in the column zone', async () => {
		const { cell } = await writeXlsx(
			[{ d: new Date('2026-11-04T13:45:00Z') }, { d: '2026-11-04T13:45:00Z' }],
			[{ key: 'd', type: 'date-time', formatOptions: { timeZone: 'UTC' } }]
		);
		const serial = (Date.UTC(2026, 10, 4, 13, 45) - Date.UTC(1899, 11, 30)) / 86_400_000;
		for (const ref of ['A2', 'A3']) {
			expect(cell(ref)?.formatCode).toBe('dd.mm.yyyy hh:mm');
			expect(Number(cell(ref)?.value)).toBeCloseTo(serial, 6);
		}
	});

	it('reads numeric strings as numbers and leaves non-numbers empty', async () => {
		const { cell } = await writeXlsx(
			[{ p: '1234567.5' }, { p: 'abc' }],
			[
				{
					key: 'p',
					type: 'number',
					formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
				}
			]
		);
		expect(cell('A2')).toMatchObject({
			type: undefined,
			value: '1234567.5',
			formatCode: '#,##0.00'
		});
		expect(cell('A3')).toBeUndefined();
	});

	it('writes a format Excel cannot express as the same text for a number and its string', async () => {
		const { cell } = await writeXlsx(
			[{ q: 12000 }, { q: '12000' }],
			[{ key: 'q', type: 'number', formatOptions: { notation: 'compact' } }]
		);
		expect(cell('A2')).toMatchObject({ type: 's', text: '12K' });
		expect(cell('A3')).toMatchObject({ type: 's', text: '12K' });
	});

	it('writes real booleans as TRUE/FALSE and leaves other values empty', async () => {
		const { cell } = await writeXlsx(
			[{ b: true }, { b: false }, { b: 'yes' }],
			[{ key: 'b', type: 'boolean' }]
		);
		expect(cell('A2')).toMatchObject({ type: 'b', value: '1' });
		expect(cell('A3')).toMatchObject({ type: 'b', value: '0' });
		expect(cell('A4')).toBeUndefined();
	});
});
