import {
	columnVisibilityFeature,
	columnResizingFeature,
	columnSizingFeature,
	createSortedRowModel,
	createTable as createTanStackTable,
	rowSelectionFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	type CellContext,
	type CellData,
	type ColumnDef,
	type ColumnResizeMode,
	type ColumnSizingState,
	type ColumnVisibilityState,
	type Row,
	type RowData,
	type RowSelectionState,
	type SortingState,
	type SvelteTable,
	type TableState
} from '@tanstack/svelte-table';
import type { DataTableColumn } from './types';

const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	columnSizingFeature,
	columnResizingFeature,
	rowSelectionFeature,
	rowSortingFeature
});

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableSelectedState = Pick<
	TableState<DataTableFeatures>,
	'columnVisibility' | 'columnSizing' | 'columnResizing' | 'rowSelection' | 'sorting'
>;
export type DataTableInstance<T extends RowData> = SvelteTable<
	DataTableFeatures,
	T,
	DataTableSelectedState
>;

export type CreateDataTableOptions<T extends RowData> = {
	data: T[];
	columns: DataTableColumn<T>[];
	columnResizeMode?: ColumnResizeMode;
	initialSorting?: SortingState;
	initialRowSelection?: RowSelectionState;
	getRowId?: (row: T, index: number, parent?: Row<DataTableFeatures, T>) => string;
	enableRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableMultiRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableSorting?: boolean;
	debugTable?: boolean;
};

export function createTable<T extends RowData>(options: CreateDataTableOptions<T>) {
	return createTanStackTable(
		{
			_features: dataTableFeatures,
			_rowModels: {
				sortedRowModel: createSortedRowModel(sortFns)
			},
			columnResizeMode: options.columnResizeMode,
			getRowId: options.getRowId,
			enableRowSelection: options.enableRowSelection ?? false,
			enableMultiRowSelection: options.enableMultiRowSelection,
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
				rowSelection: options.initialRowSelection ?? {},
				sorting: options.initialSorting ?? []
			}
		},
		(state): DataTableSelectedState => ({
			columnVisibility: state.columnVisibility,
			columnSizing: state.columnSizing,
			columnResizing: state.columnResizing,
			rowSelection: state.rowSelection,
			sorting: state.sorting
		})
	);
}

function createColumnVisibility<T extends RowData>(columns: DataTableColumn<T>[]) {
	return columns.reduce<ColumnVisibilityState>((visibility, column) => {
		visibility[getColumnId(column)] = true;
		return visibility;
	}, {});
}

function createColumnSizing<T extends RowData>(columns: DataTableColumn<T>[]) {
	return columns.reduce<ColumnSizingState>((sizes, column) => {
		if (typeof column.size === 'number') {
			sizes[getColumnId(column)] = column.size;
		}

		return sizes;
	}, {});
}

function createColumns<T extends RowData>(columns: DataTableColumn<T>[]) {
	return columns.map((column) => {
		const columnId = getColumnId(column);
		const columnDef = {
			id: columnId,
			header: column.header,
			size: column.size,
			minSize: column.minSize,
			maxSize: column.maxSize,
			enableResizing: column.enableResizing,
			enableHiding: getColumnEnableHiding(column, columnId),
			enableSorting: column.enableSorting,
			sortDescFirst: column.sortDescFirst,
			meta: {
				align: column.align
			}
		} satisfies Partial<ColumnDef<DataTableFeatures, T, CellData>>;

		if (typeof column.accessorFn === 'function') {
			return {
				...columnDef,
				accessorFn: column.accessorFn,
				cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
					formatCellValue(column, context.getValue(), context.row.original)
			};
		}

		return {
			...columnDef,
			accessorKey: column.accessorKey,
			cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
				formatCellValue(column, context.getValue(), context.row.original)
		};
	}) as ColumnDef<DataTableFeatures, T, CellData>[];
}

function getColumnEnableHiding<T extends RowData>(column: DataTableColumn<T>, columnId: string) {
	if (column.enableHiding !== undefined) return column.enableHiding;
	if (columnId === 'id') return false;
	return undefined;
}

export function getColumnId<T extends RowData>(column: DataTableColumn<T>): string {
	if (column.id !== undefined) return column.id;
	if ('accessorKey' in column && column.accessorKey !== undefined) return column.accessorKey;
	throw new Error('DataTableColumn with accessorFn requires an id.');
}

function formatCellValue<T extends RowData>(column: DataTableColumn<T>, value: unknown, row: T) {
	const renderedValue = column.cell ? column.cell(value, row) : value;

	if (renderedValue === null || renderedValue === undefined || renderedValue === '') {
		return '-';
	}

	return String(renderedValue);
}
