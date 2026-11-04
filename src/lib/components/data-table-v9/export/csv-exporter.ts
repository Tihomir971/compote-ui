import { toCsv, type CsvOptions } from '../../../utils/csv';
import { downloadBlob } from '../../../utils/download';
import { PhFileText } from '#lib/icons';
import type { DataTableExportColumn, DataTableExportData } from './export-data';
import type { DataTableExporter } from './types';

export type CsvExporterOptions = CsvOptions & {
	id?: string;
	label?: string;
};

const NUMBER_TYPES = new Set(['number', 'currency', 'percent']);

// Spreadsheet apps run a field starting with one of these as a formula (CSV injection).
const FORMULA_START = /^[=+\-@\t\r]/;
// Digits, spaces and number punctuation only (`+381 60 123`, `-5`, `(011) 22-33`): at worst
// arithmetic, it can't call a function, so it is left as is. Spaces include the no-break ones
// Intl groups digits with; tab and CR stay guarded.
const NUMERIC_LIKE = new RegExp('^[+-]?[\\d \\u00a0\\u202f().,/+-]*$');

/** Neutralizes a field a spreadsheet would run as a formula, by prefixing `'`. */
export function guardCsvFormula(text: string): string {
	return FORMULA_START.test(text) && !NUMERIC_LIKE.test(text) ? `'${text}` : text;
}

// Only a number column without its own `cell` is known to hold Intl-formatted text, so a
// leading `-` there is a sign even next to a currency name (`-US$ 5`). Any `cell` may return
// arbitrary text.
function isFormattedNumber(column: DataTableExportColumn): boolean {
	return column.type !== undefined && NUMBER_TYPES.has(column.type) && !column.hasCustomCell;
}

/** The export data as rows of CSV fields, header first, guarded against formula injection. */
export function exportDataToCsvRows(data: DataTableExportData): string[][] {
	const header = data.columns.map((column) => guardCsvFormula(column.header));
	const rows = data.rows.map((cells) =>
		cells.map((cell, index) => {
			const column = data.columns[index];
			return column && isFormattedNumber(column) ? cell.text : guardCsvFormula(cell.text);
		})
	);
	return [header, ...rows];
}

/** A CSV exporter: the text the table shows, BOM-prefixed and `;`-separated by default. */
export function createCsvExporter(options: CsvExporterOptions = {}): DataTableExporter {
	const { id = 'csv', label = 'CSV', ...csvOptions } = options;
	return {
		id,
		label,
		icon: PhFileText,
		export: ({ filename, getData }) => {
			const csv = toCsv(exportDataToCsvRows(getData()), csvOptions);
			downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), `${filename}.csv`);
		}
	};
}

export const csvExporter: DataTableExporter = createCsvExporter();
