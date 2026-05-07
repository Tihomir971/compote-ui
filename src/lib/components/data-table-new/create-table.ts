import {
	columnVisibilityFeature,
	columnResizingFeature,
	columnSizingFeature,
	createSortedRowModel,
	createTable as createTanStackTable,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	type CellContext,
	type CellData,
	type ColumnDef,
	type ColumnResizeMode,
	type ColumnSizingState,
	type ColumnVisibilityState,
	type SortingState,
	type SvelteTable,
	type TableState
} from '@tanstack/svelte-table';
import type { DataTableColumn } from './types';

const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	columnSizingFeature,
	columnResizingFeature,
	rowSortingFeature
});

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableSelectedState = Pick<
	TableState<DataTableFeatures>,
	'columnVisibility' | 'columnSizing' | 'columnResizing' | 'sorting'
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
	initialSorting?: SortingState;
	enableSorting?: boolean;
	debugTable?: boolean;
};

export function createTable<T extends object>(options: CreateDataTableOptions<T>) {
	return createTanStackTable(
		{
			_features: dataTableFeatures,
			_rowModels: {
				sortedRowModel: createSortedRowModel(sortFns)
			},
			columnResizeMode: options.columnResizeMode,
			enableSorting: options.enableSorting,
			debugTable: options.debugTable,
			get data() {
				return options.data;
			},
			get columns() {
				return createColumns(options.columns);
			},
			initialState: {
				columnVisibility: createColumnVisibility(options.columns),
				columnSizing: createColumnSizing(options.columns),
				sorting: options.initialSorting ?? []
			}
		},
		(state): DataTableSelectedState => ({
			columnVisibility: state.columnVisibility,
			columnSizing: state.columnSizing,
			columnResizing: state.columnResizing,
			sorting: state.sorting
		})
	);
}

function createColumnVisibility<T extends object>(columns: DataTableColumn<T>[]) {
	return columns.reduce<ColumnVisibilityState>((visibility, column) => {
		visibility[column.id] = true;
		return visibility;
	}, {});
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
			enableHiding: column.enableHiding,
			enableSorting: column.enableSorting,
			sortDescFirst: column.sortDescFirst,
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
