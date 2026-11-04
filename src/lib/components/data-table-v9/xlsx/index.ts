import type { SheetData } from 'write-excel-file/browser';
import { PhMicrosoftExcelLogo } from '#lib/icons';
import { downloadBlob } from '../../../utils/download';
import type { DataTableExportData } from '../export/export-data';
import type { DataTableExporter } from '../export/types';
import {
	DEFAULT_XLSX_DATE_FORMATS,
	toXlsxCell,
	type XlsxCell,
	type XlsxDateFormats
} from './xlsx-cell';

export { DEFAULT_XLSX_DATE_FORMATS, toXlsxCell, xlsxNumberFormat } from './xlsx-cell';
export type { XlsxCell, XlsxDateFormats, XlsxDatePart } from './xlsx-cell';

export type XlsxExporterOptions = Partial<XlsxDateFormats> & {
	id?: string;
	label?: string;
	/** Sheet name (Excel allows 31 characters, without `[ ] : * ? / \`). */
	sheet?: string;
};

// Column widths in characters of Excel's default font.
const MIN_COLUMN_WIDTH = 8;
const MAX_COLUMN_WIDTH = 60;
// One character of slack: char counts already overshoot narrow lowercase text, and this keeps
// wide letters (W, M, capitals) from being cut off.
const COLUMN_WIDTH_PADDING = 1;

/** Characters in the longest line of `text` (code points, so č or 🙂 count once). */
function longestLine(text: string): number {
	let longest = 0;
	for (const line of text.split(/\r\n|\r|\n/)) longest = Math.max(longest, Array.from(line).length);
	return longest;
}

/**
 * A width per column that fits its header and the longest cell text (the text the table
 * shows, which is close to what Excel shows), plus padding, between 8 and 60 characters.
 */
export function xlsxColumnWidths(data: DataTableExportData): number[] {
	return data.columns.map((column, index) => {
		let longest = longestLine(column.header);
		for (const cells of data.rows) {
			const text = cells[index]?.text;
			if (text) longest = Math.max(longest, longestLine(text));
		}
		return Math.min(MAX_COLUMN_WIDTH, Math.max(MIN_COLUMN_WIDTH, longest + COLUMN_WIDTH_PADDING));
	});
}

/** The export data as sheet rows: a bold header row, then typed cells. */
export function exportDataToSheet(
	data: DataTableExportData,
	formats: XlsxDateFormats = DEFAULT_XLSX_DATE_FORMATS
): XlsxCell[][] {
	const header: XlsxCell[] = data.columns.map((column) => ({
		type: String,
		value: column.header,
		fontWeight: 'bold'
	}));
	const rows = data.rows.map((cells) =>
		data.columns.map((column, index) => {
			const cell = cells[index];
			return cell ? toXlsxCell(column, cell, formats) : null;
		})
	);
	return [header, ...rows];
}

/**
 * The export data as an .xlsx file. Loads `write-excel-file` (an optional peer dependency) on
 * first call, so importing this module costs nothing until an export runs — and stays SSR-safe.
 */
export async function exportDataToXlsxBlob(
	data: DataTableExportData,
	options: XlsxExporterOptions = {}
): Promise<Blob> {
	const { default: writeXlsxFile } = await import('write-excel-file/browser');
	const formats = { ...DEFAULT_XLSX_DATE_FORMATS, ...pickFormats(options) };
	const sheetData = exportDataToSheet(data, formats);
	// XlsxCell is a subset of the package's cell shape; cast via its own (type-only) type.
	return writeXlsxFile(sheetData as SheetData, {
		sheet: options.sheet,
		stickyRowsCount: 1,
		columns: xlsxColumnWidths(data).map((width) => ({ width }))
	}).toBlob();
}

function pickFormats({ date, time, dateTime }: XlsxExporterOptions): Partial<XlsxDateFormats> {
	return {
		...(date !== undefined ? { date } : {}),
		...(time !== undefined ? { time } : {}),
		...(dateTime !== undefined ? { dateTime } : {})
	};
}

/**
 * An Excel exporter: numbers, dates and booleans as typed cells, formatted like the table.
 * Needs `write-excel-file` installed.
 */
export function createXlsxExporter(options: XlsxExporterOptions = {}): DataTableExporter {
	const { id = 'xlsx', label = 'Excel' } = options;
	return {
		id,
		label,
		icon: PhMicrosoftExcelLogo,
		export: async ({ filename, getData }) => {
			const blob = await exportDataToXlsxBlob(getData(), options);
			downloadBlob(blob, `${filename}.xlsx`);
		}
	};
}

export const xlsxExporter: DataTableExporter = createXlsxExporter();
