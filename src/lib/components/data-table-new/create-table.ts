import {
	columnResizingFeature,
	columnSizingFeature,
	createTable as createTanStackTable,
	tableFeatures,
	type CellContext,
	type CellData,
	type ColumnDef,
	type ColumnResizeMode,
	type ColumnSizingState,
	type SvelteTable,
	type TableState
} from '@tanstack/svelte-table';
import type { DataTableColumn } from './types';

const dataTableFeatures = tableFeatures({ columnSizingFeature, columnResizingFeature });

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableSelectedState = Pick<
	TableState<DataTableFeatures>,
	'columnSizing' | 'columnResizing'
>;
export type DataTableInstance<T extends object> = SvelteTable<
	DataTableFeatures,
	T,
	DataTableSelectedState
>;

export type CreateDataTableOptions<T extends object> = {
	data: T[];
	columns: DataTableColumn<T>[];
	columnResizeMode?: ColumnResizeMode;
	debugTable?: boolean;
};

export function createTable<T extends object>(options: CreateDataTableOptions<T>) {
	return createTanStackTable(
		{
			_features: dataTableFeatures,
			columnResizeMode: options.columnResizeMode,
			debugTable: options.debugTable,
			get data() {
				return options.data;
			},
			get columns() {
				return createColumns(options.columns);
			},
			initialState: {
				columnSizing: createColumnSizing(options.columns)
			}
		},
		(state): DataTableSelectedState => ({
			columnSizing: state.columnSizing,
			columnResizing: state.columnResizing
		})
	);
}

function createColumnSizing<T extends object>(columns: DataTableColumn<T>[]) {
	return columns.reduce<ColumnSizingState>((sizes, column) => {
		if (typeof column.size === 'number') {
			sizes[column.id] = column.size;
		}

		return sizes;
	}, {});
}

function createColumns<T extends object>(columns: DataTableColumn<T>[]) {
	return columns.map((column) => {
		const columnDef = {
			id: column.id,
			header: column.header,
			size: column.size,
			minSize: column.minSize,
			maxSize: column.maxSize,
			enableResizing: column.enableResizing,
			meta: {
				align: column.align
			}
		} satisfies Partial<ColumnDef<DataTableFeatures, T, CellData>>;

		if (typeof column.accessor === 'function') {
			return {
				...columnDef,
				accessorFn: column.accessor,
				cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
					formatCellValue(column, context.getValue(), context.row.original)
			};
		}

		return {
			...columnDef,
			accessorKey: String(column.accessor),
			cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
				formatCellValue(column, context.getValue(), context.row.original)
		};
	}) as ColumnDef<DataTableFeatures, T, CellData>[];
}

function formatCellValue<T extends object>(column: DataTableColumn<T>, value: unknown, row: T) {
	const renderedValue = column.cell ? column.cell(value, row) : value;

	if (renderedValue === null || renderedValue === undefined || renderedValue === '') {
		return '-';
	}

	return String(renderedValue);
}
