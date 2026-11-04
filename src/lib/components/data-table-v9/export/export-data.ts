import type { Column, RowData } from '@tanstack/svelte-table';
import { getColumnLabel, getColumnMeta, type DataTableInstance } from '../data-table-utils';
import type { DataTableFeatures } from '../features';
import type { DataTableColumnType } from '../types';

/** Which rows an export writes. Both keep the table's filtering and sorting. */
export type DataTableExportScope = 'filtered' | 'selected';

export type DataTableExportColumn = {
	id: string;
	/** The column header; a grouped column's reads `Group / Column`. */
	header: string;
	type?: DataTableColumnType;
	formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
	/** The column has its own `cell` renderer: its text is not derived from `type`. */
	hasCustomCell: boolean;
	/** The column sets `exportValue`, so `value` is that, not the accessor value. */
	hasExportValue: boolean;
	locale: string;
	/** Current width in px. */
	size: number;
};

export type DataTableExportCell = {
	/** `exportValue` output when the column sets one, else the accessor value. */
	value: unknown;
	/** The text the table shows for this cell; `''` when empty. */
	text: string;
};

export type DataTableExportData = {
	columns: DataTableExportColumn[];
	rows: DataTableExportCell[][];
};

type TableColumn<T extends RowData> = Column<DataTableFeatures, T, unknown>;

/**
 * The rows an export writes, in table order: filtered and sorted, and for `selected` only the
 * selected ones among them (a selected row the filter hides is not exported).
 */
export function getExportRows<T extends RowData>(
	table: DataTableInstance<T>,
	scope: DataTableExportScope
) {
	const rows = table.getRowModel().rows;
	return scope === 'selected' ? rows.filter((row) => row.getIsSelected()) : rows;
}

/** Visible columns that exports include, in the order the table shows them (pinning). */
export function getExportColumns<T extends RowData>(table: DataTableInstance<T>) {
	return [
		...table.getStartVisibleLeafColumns(),
		...table.getCenterVisibleLeafColumns(),
		...table.getEndVisibleLeafColumns()
	].filter((column) => getColumnMeta(column.columnDef)?.export?.enabled === true);
}

function exportHeader<T extends RowData>(column: TableColumn<T>): string {
	const labels: string[] = [];
	for (let current: TableColumn<T> | undefined = column; current; current = current.parent) {
		labels.unshift(getColumnLabel(current));
	}
	return labels.join(' / ');
}

/** The columns and cells an export writes. */
export function getExportData<T extends RowData>(
	table: DataTableInstance<T>,
	scope: DataTableExportScope
): DataTableExportData {
	const columns = getExportColumns(table).flatMap((column) => {
		const meta = getColumnMeta(column.columnDef);
		const exportMeta = meta?.export;
		return exportMeta ? [{ column, meta, exportMeta }] : [];
	});

	return {
		columns: columns.map(({ column, meta, exportMeta }) => ({
			id: column.id,
			header: exportHeader(column),
			type: meta.type,
			formatOptions: meta.formatOptions,
			hasCustomCell: exportMeta.hasCustomCell,
			hasExportValue: exportMeta.exportValue !== undefined,
			locale: exportMeta.resolveLocale(),
			size: column.getSize()
		})),
		rows: getExportRows(table, scope).map((row) =>
			columns.map(({ column, exportMeta }): DataTableExportCell => {
				const original = row.original as never;
				const raw = row.getValue(column.id);
				const { exportValue, formatText, formatTypedText } = exportMeta;
				const value = exportValue ? exportValue(raw, original) : raw;
				// `cell` always gets the accessor value — the text matches what the table shows.
				const text =
					exportValue && !exportMeta.hasCustomCell
						? formatTypedText(value)
						: formatText(raw, original);
				return { value, text: text ?? '' };
			})
		)
	};
}
