import { TYPE_NUMBER_FORMAT_DEFAULTS } from '../data-table-utils';
import { formatDateCell } from '../date-cell';
import type {
	DataTableExportCell,
	DataTableExportColumn,
	DataTableExportData
} from '../export/export-data';
import type { DataTableColumnType } from '../types';

/**
 * A column of plain row objects for `exportRowsToXlsxBlob`: which key to read, and how the
 * values are typed (the same `type` and `formatOptions` a DataTable column has).
 */
export type XlsxRowsColumn = {
	/** The key to read from each row object. */
	key: string;
	/** The header cell; defaults to `key`. */
	header?: string;
	/**
	 * How the value is written. `number`, `currency` and `percent` become Excel numbers, `date`,
	 * `time` and `date-time` Excel dates, `boolean` TRUE/FALSE. Without a type (or `text`) the
	 * value is written as text, so a numeric column needs a type to stay computable.
	 */
	type?: DataTableColumnType;
	/**
	 * Intl options for the Excel format of a typed column: `{ minimumFractionDigits: 2,
	 * maximumFractionDigits: 2 }` for fixed decimals, `{ useGrouping: false,
	 * maximumFractionDigits: 0 }` for whole numbers without a thousands separator (`useGrouping:
	 * false` alone keeps the decimals a value has). A `number` column with none shows as many
	 * decimals as each value has (up to 3).
	 */
	formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
};

const NUMBER_TYPES = new Set<DataTableColumnType>(['number', 'currency', 'percent']);

const isEmpty = (value: unknown) => value === null || value === undefined || value === '';

/**
 * The text a DataTable cell of this type would show (same rules as the table's own cell text):
 * what text and fallback cells write, and what column widths are measured on. `''` when the
 * table would show `-`.
 */
function cellText(column: XlsxRowsColumn, value: unknown, locale: string): string {
	if (isEmpty(value)) return '';
	const { type } = column;
	try {
		if (type && NUMBER_TYPES.has(type)) {
			// Like the table: numeric strings count as numbers, anything else shows nothing.
			const number = Number(value);
			if (Number.isNaN(number)) return '';
			return new Intl.NumberFormat(locale, {
				...TYPE_NUMBER_FORMAT_DEFAULTS[type],
				...(column.formatOptions as Intl.NumberFormatOptions | undefined)
			}).format(number);
		}
		if (type === 'date' || type === 'time' || type === 'date-time') {
			// Reads a Date, an ISO/DB string, an epoch number... the way the table does.
			return (
				formatDateCell(value, type, locale, column.formatOptions as Intl.DateTimeFormatOptions) ??
				''
			);
		}
		if (type === 'boolean') return value ? 'Yes' : 'No';
	} catch {
		// Invalid Intl options: fall back to the plain string.
	}
	return String(value);
}

/**
 * Plain row objects as the export data the xlsx exporter takes, so they get the same typed
 * cells, bold frozen header and content-fitted widths as a DataTable export.
 */
export function rowsToExportData(
	rows: ReadonlyArray<Record<string, unknown>>,
	columns: ReadonlyArray<XlsxRowsColumn>,
	locale = 'en-US'
): DataTableExportData {
	return {
		columns: columns.map((column): DataTableExportColumn => ({
			id: column.key,
			header: column.header ?? column.key,
			type: column.type,
			formatOptions: column.formatOptions,
			hasCustomCell: false,
			hasExportValue: false,
			locale,
			// Only a table has a width in px; an xlsx export measures the content instead.
			size: 0
		})),
		rows: rows.map((row) =>
			columns.map((column): DataTableExportCell => {
				const value = row[column.key];
				return { value, text: cellText(column, value, locale) };
			})
		)
	};
}
