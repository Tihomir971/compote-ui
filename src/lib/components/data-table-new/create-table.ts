import {
	columnVisibilityFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	createSortedRowModel,
	createFilteredRowModel,
	createFacetedRowModel,
	createFacetedMinMaxValues,
	createFacetedUniqueValues,
	createTable as createTanStackTable,
	filterFns,
	rowSelectionFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	type CellContext,
	type CellData,
	type ColumnDef,
	type ColumnFiltersState,
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
import type { DataTableColumn, DataTableColumnType } from './types';

const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	columnSizingFeature,
	columnResizingFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	rowSelectionFeature,
	rowSortingFeature
});

export type DataTableFeatures = typeof dataTableFeatures;
export type DataTableSelectedState = Pick<
	TableState<DataTableFeatures>,
	| 'columnVisibility'
	| 'columnSizing'
	| 'columnResizing'
	| 'rowSelection'
	| 'sorting'
	| 'columnFilters'
>;

function oneOfFilterFn(
	row: Row<DataTableFeatures, RowData>,
	columnId: string,
	filterValue: string[]
): boolean {
	return filterValue.includes(String(row.getValue(columnId)));
}
oneOfFilterFn.autoRemove = (val: unknown): boolean => !Array.isArray(val) || val.length === 0;
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
	initialColumnFilters?: ColumnFiltersState;
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
				sortedRowModel: createSortedRowModel(sortFns),
				filteredRowModel: createFilteredRowModel({ ...filterFns, oneOf: oneOfFilterFn }),
				facetedRowModel: createFacetedRowModel(),
				facetedMinMaxValues: createFacetedMinMaxValues(),
				facetedUniqueValues: createFacetedUniqueValues()
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
				sorting: options.initialSorting ?? [],
				columnFilters: options.initialColumnFilters ?? []
			}
		},
		(state): DataTableSelectedState => ({
			columnVisibility: state.columnVisibility,
			columnSizing: state.columnSizing,
			columnResizing: state.columnResizing,
			rowSelection: state.rowSelection,
			sorting: state.sorting,
			columnFilters: state.columnFilters
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
		const derivedFilterFn = column.filterFn ?? getFilterFnForType(column.type);
		const columnDef = {
			id: columnId,
			header: column.header,
			size: column.size,
			minSize: column.minSize,
			maxSize: column.maxSize,
			enableResizing: column.enableResizing,
			enableHiding: getColumnEnableHiding(column, columnId),
			enableSorting: column.enableSorting,
			enableColumnFilter: column.enableColumnFilter,
			sortDescFirst: column.sortDescFirst,
			...(derivedFilterFn !== undefined ? { filterFn: derivedFilterFn as never } : {}),
			meta: {
				align: column.align,
				type: column.type,
				formatOptions: column.formatOptions,
				formatLocale: column.formatLocale
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

const TYPE_FORMAT_DEFAULTS: Partial<Record<DataTableColumnType, Intl.NumberFormatOptions>> = {
	currency: { style: 'currency', currency: 'USD' },
	percent: { style: 'percent' },
	number: {}
};

function getFilterFnForType(type: DataTableColumnType | undefined): string | undefined {
	switch (type) {
		case 'number':
		case 'currency':
		case 'percent':
			return 'inNumberRange';
		case 'boolean':
			return 'equals';
		case 'select':
			return 'oneOf';
		default:
			return undefined;
	}
}

function applyTypeFormat<T extends RowData>(
	column: DataTableColumn<T>,
	value: unknown
): string | number | boolean | null | undefined {
	if (value === null || value === undefined || value === '') return undefined;

	const defaults = column.type ? TYPE_FORMAT_DEFAULTS[column.type] : undefined;
	if (defaults !== undefined) {
		return new Intl.NumberFormat(column.formatLocale, {
			...defaults,
			...column.formatOptions
		}).format(Number(value));
	}

	if (column.type === 'boolean') return value ? 'Yes' : 'No';

	return value as string | number | boolean;
}

function formatCellValue<T extends RowData>(column: DataTableColumn<T>, value: unknown, row: T) {
	const rendered = column.cell ? column.cell(value, row) : applyTypeFormat(column, value);

	if (rendered === null || rendered === undefined || rendered === '') {
		return '-';
	}

	return String(rendered);
}
