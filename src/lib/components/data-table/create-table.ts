import {
	columnVisibilityFeature,
	columnResizingFeature,
	columnSizingFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	columnPinningFeature,
	columnOrderingFeature,
	createSortedRowModel,
	createFilteredRowModel,
	createFacetedRowModel,
	createFacetedMinMaxValues,
	createFacetedUniqueValues,
	createTable as createTanStackTable,
	filterFns,
	renderComponent,
	renderSnippet,
	rowSelectionFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
	type CellContext,
	type CellData,
	type ColumnDef,
	type ColumnPinningState,
	type ColumnResizeMode,
	type ColumnSizingState,
	type ColumnVisibilityState,
	type Row,
	type RowData,
	type SvelteTable,
	type TableState
} from '@tanstack/svelte-table';
import type { Component } from 'svelte';
import { useLocaleContext } from '@ark-ui/svelte/locale';
import type {
	DataTableColumn,
	DataTableColumnType,
	DataTableGroupColumn,
	DataTableLeafColumn
} from './types';

const dataTableFeatures = tableFeatures({
	columnVisibilityFeature,
	columnSizingFeature,
	columnResizingFeature,
	columnFilteringFeature,
	columnFacetingFeature,
	columnPinningFeature,
	columnOrderingFeature,
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
	initialState?: Partial<TableState<DataTableFeatures>>;
	getRowId?: (row: T, index: number, parent?: Row<DataTableFeatures, T>) => string;
	enableRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableMultiRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableSorting?: boolean;
	debugTable?: boolean;
};

export function createTable<T extends RowData>(options: CreateDataTableOptions<T>) {
	const localeCtx = useLocaleContext();
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
				return createColumns(options.columns, localeCtx);
			},
			initialState: {
				...options.initialState,
				columnVisibility: {
					...createColumnVisibility(options.columns),
					...options.initialState?.columnVisibility
				},
				columnSizing: {
					...createColumnSizing(options.columns),
					...options.initialState?.columnSizing
				},
				columnPinning: options.initialState?.columnPinning ?? createColumnPinning(options.columns),
				rowSelection: options.initialState?.rowSelection ?? {},
				sorting: options.initialState?.sorting ?? [],
				columnFilters: options.initialState?.columnFilters ?? []
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
	return getLeafColumns(columns).reduce<ColumnVisibilityState>((visibility, column) => {
		visibility[getColumnId(column)] = true;
		return visibility;
	}, {});
}

function createColumnSizing<T extends RowData>(columns: DataTableColumn<T>[]) {
	return getLeafColumns(columns).reduce<ColumnSizingState>((sizes, column) => {
		if (typeof column.size === 'number') {
			sizes[getColumnId(column)] = column.size;
		}

		return sizes;
	}, {});
}

function createColumnPinning<T extends RowData>(columns: DataTableColumn<T>[]): ColumnPinningState {
	const leafCols = getLeafColumns(columns);
	return {
		left: leafCols.filter((c) => c.pinned === 'left').map(getColumnId),
		right: leafCols.filter((c) => c.pinned === 'right').map(getColumnId)
	};
}

function createColumns<T extends RowData>(
	columns: DataTableColumn<T>[],
	localeCtx: ReturnType<typeof useLocaleContext>
): ColumnDef<DataTableFeatures, T, CellData>[] {
	return columns.map((column) => {
		if (isGroupColumn(column)) {
			return {
				id: getGroupColumnId(column),
				header: column.header,
				columns: createColumns(column.columns, localeCtx),
				meta: {
					align: column.align
				}
			};
		}

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
				formatLocale: column.formatLocale,
				grow: column.grow
			}
		} satisfies Partial<ColumnDef<DataTableFeatures, T, CellData>>;

		if (typeof column.accessorFn === 'function') {
			return {
				...columnDef,
				accessorFn: column.accessorFn,
				cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
					formatCellValue(column, context.getValue(), context.row.original, localeCtx)
			};
		}

		return {
			...columnDef,
			accessorKey: column.accessorKey,
			cell: (context: CellContext<DataTableFeatures, T, CellData>) =>
				formatCellValue(column, context.getValue(), context.row.original, localeCtx)
		};
	}) as ColumnDef<DataTableFeatures, T, CellData>[];
}

function isGroupColumn<T extends RowData>(
	column: DataTableColumn<T>
): column is DataTableGroupColumn<T> {
	return Array.isArray(column.columns);
}

function getLeafColumns<T extends RowData>(
	columns: DataTableColumn<T>[]
): DataTableLeafColumn<T>[] {
	return columns.flatMap((column) =>
		isGroupColumn(column) ? getLeafColumns(column.columns) : column
	);
}

function getGroupColumnId<T extends RowData>(column: DataTableGroupColumn<T>) {
	return column.id ?? column.header;
}

function getColumnEnableHiding<T extends RowData>(
	column: DataTableLeafColumn<T>,
	columnId: string
) {
	if (column.enableHiding !== undefined) return column.enableHiding;
	if (columnId === 'id') return false;
	return undefined;
}

export function getColumnId<T extends RowData>(column: DataTableLeafColumn<T>): string {
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
	column: DataTableLeafColumn<T>,
	value: unknown,
	localeCtx: ReturnType<typeof useLocaleContext>
): string | number | boolean | null | undefined {
	if (value === null || value === undefined || value === '') return undefined;

	const defaults = column.type ? TYPE_FORMAT_DEFAULTS[column.type] : undefined;
	if (defaults !== undefined) {
		const locale = column.formatLocale ?? localeCtx().locale;
		return new Intl.NumberFormat(locale, {
			...defaults,
			...column.formatOptions
		}).format(Number(value));
	}

	if (column.type === 'boolean') return value ? 'Yes' : 'No';

	return value as string | number | boolean;
}

function formatCellValue<T extends RowData>(
	column: DataTableLeafColumn<T>,
	value: unknown,
	row: T,
	localeCtx: ReturnType<typeof useLocaleContext>
) {
	if (column.cellComponent) {
		return renderComponent(
			column.cellComponent as Component<Record<string, unknown>>,
			getCellComponentProps(column, value, row)
		);
	}

	if (column.cellSnippet) {
		return renderSnippet(column.cellSnippet, { value, row });
	}

	const rendered = column.cell
		? column.cell(value, row)
		: applyTypeFormat(column, value, localeCtx);

	if (rendered === null || rendered === undefined || rendered === '') {
		return '-';
	}

	return String(rendered);
}

function getCellComponentProps<T extends RowData>(
	column: DataTableLeafColumn<T>,
	value: unknown,
	row: T
) {
	return column.cellProps ? column.cellProps(value, row) : { value, row };
}
