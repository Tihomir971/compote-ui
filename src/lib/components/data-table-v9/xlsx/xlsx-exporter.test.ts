import { describe, expect, it } from 'vitest';
import { strFromU8, unzipSync } from 'fflate';
import type { DataTableExportColumn, DataTableExportData } from '../export/export-data';
import { exportDataToXlsxBlob } from './index';

function column(overrides: Partial<DataTableExportColumn>): DataTableExportColumn {
	return {
		id: 'col',
		header: 'Col',
		hasCustomCell: false,
		hasExportValue: false,
		locale: 'en-US',
		size: 140,
		...overrides
	};
}

const data: DataTableExportData = {
	columns: [
		column({ id: 'name', header: 'Name', type: 'text' }),
		column({ id: 'amount', header: 'Amount', type: 'currency' }),
		column({ id: 'day', header: 'Day', type: 'date' }),
		column({ id: 'active', header: 'Active', type: 'boolean' }),
		column({ id: 'start', header: 'Start', type: 'time' })
	],
	rows: [
		[
			{ value: 'Ada', text: 'Ada' },
			{ value: 1234.5, text: '$1,234.50' },
			{ value: '2024-03-15T13:45:00', text: '03/15/2024' },
			{ value: true, text: 'Yes' },
			// No offset: read as wall-clock time in the column zone, whatever zone the test runs in.
			{ value: '2024-03-15T09:30:00', text: '09:30 AM' }
		],
		[
			{ value: null, text: '' },
			{ value: null, text: '' },
			{ value: null, text: '' },
			{ value: null, text: '' },
			{ value: null, text: '' }
		]
	]
};

/** Writes a real .xlsx with write-excel-file and returns its unzipped XML parts. */
async function writeXlsx() {
	const blob = await exportDataToXlsxBlob(data, { sheet: 'People' });
	const files = unzipSync(new Uint8Array(await blob.arrayBuffer()));
	const read = (path: string) => {
		const file = files[path];
		if (!file) throw new Error(`missing ${path}`);
		return strFromU8(file);
	};
	return {
		sheet: read('xl/worksheets/sheet1.xml'),
		styles: read('xl/styles.xml'),
		strings: read('xl/sharedStrings.xml'),
		workbook: read('xl/workbook.xml')
	};
}

describe('exportDataToXlsxBlob', () => {
	it('writes typed cells: text, number, date serial and boolean', async () => {
		const { sheet, strings } = await writeXlsx();
		expect(strings).toContain('Ada');
		// Row 2: A2 is a shared string, B2 a number, C2 the Excel serial of 2024-03-15 (a date
		// column drops its time), D2 a boolean, E2 the time of day alone (09:30 = 0.39583…).
		expect(sheet).toMatch(/<c r="A2"[^>]*t="s"/);
		expect(sheet).toMatch(/<c r="B2"[^>]*><v>1234\.5<\/v>/);
		expect(sheet).toMatch(/<c r="C2"[^>]*><v>45366<\/v>/);
		expect(sheet).toMatch(/<c r="D2"[^>]*t="b"[^>]*><v>1<\/v>/);
		expect(sheet).toMatch(/<c r="E2"[^>]*><v>0\.3958333333/);
	});

	it('leaves empty cells out', async () => {
		const { sheet } = await writeXlsx();
		expect(sheet).not.toMatch(/r="[A-E]3"/);
	});

	it('stores the number and date formats', async () => {
		const { styles } = await writeXlsx();
		expect(styles).toContain('formatCode="#,##0.00 &quot;USD&quot;"');
		expect(styles).toContain('formatCode="dd.mm.yyyy"');
	});

	it('freezes the header row, sets column widths and names the sheet', async () => {
		const { sheet, workbook } = await writeXlsx();
		expect(sheet).toContain('ySplit="1"');
		expect(sheet).toMatch(/<col [^>]*width="20"/);
		expect(workbook).toContain('name="People"');
	});
});
