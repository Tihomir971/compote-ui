import {
	getCoreRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFacetedMinMaxValues,
	type ColumnDef,
	type ColumnPinningState,
	type ColumnResizeMode,
	type ColumnSizingState,
	type VisibilityState,
	type FilterFn,
	type Row,
	type RowData,
	type Table,
	type TableState,
	type Updater
} from '@tanstack/table-core';
import { useLocaleContext } from '@ark-ui/svelte/locale';
import type { Component } from 'svelte';
import { createSvelteTable } from './create-svelte-table.svelte';
import { renderComponent, renderSnippet } from './render-helpers';
import type {
	DataTableColumn,
	DataTableColumnType,
	DataTableGroupColumn,
	DataTableLeafColumn,
	DataTableColumnMeta
} from './types';

declare module '@tanstack/table-core' {
	interface FilterFns {
		oneOf: FilterFn<unknown>;
	}
}

function oneOfFilterFn<T extends RowData>(
	row: Row<T>,
	columnId: string,
	filterValue: string[]
): boolean {
	return filterValue.includes(String(row.getValue(columnId)));
}
oneOfFilterFn.autoRemove = (val: unknown): boolean => !Array.isArray(val) || val.length === 0;

export type DataTableInstance<T extends RowData> = Table<T>;

export type CreateDataTableOptions<T extends RowData> = {
	data: T[];
	columns: DataTableColumn<T>[];
	columnResizeMode?: ColumnResizeMode;
	initialState?: {
		columnVisibility?: VisibilityState;
		columnSizing?: ColumnSizingState;
		columnPinning?: ColumnPinningState;
		rowSelection?: Record<string, boolean>;
		sorting?: { id: string; desc: boolean }[];
		columnFilters?: { id: string; value: unknown }[];
	};
	getRowId?: (row: T, index: number, parent?: Row<T>) => string;
	enableRowSelection?: boolean | ((row: Row<T>) => boolean);
	enableMultiRowSelection?: boolean | ((row: Row<T>) => boolean);
	enableSorting?: boolean;
	debugTable?: boolean;
	onColumnVisibilityChange?: (visibility: VisibilityState) => void;
};

export function createTable<T extends RowData>(options: CreateDataTableOptions<T>) {
	const localeCtx = useLocaleContext();

	const initialColumnVisibility = {
		...createColumnVisibility(options.columns),
		...options.initialState?.columnVisibility
	};

	const table = createSvelteTable<T>({
		get data() {
			return options.data;
		},
		columns: createColumns(options.columns, localeCtx),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFacetedMinMaxValues: getFacetedMinMaxValues(),
		columnResizeMode: options.columnResizeMode,
		getRowId: options.getRowId,
		enableRowSelection: options.enableRowSelection ?? false,
		enableMultiRowSelection: options.enableMultiRowSelection,
		enableSorting: options.enableSorting,
		debugTable: options.debugTable,
		filterFns: {
			oneOf: oneOfFilterFn as FilterFn<T>
		},
		onColumnVisibilityChange: (updater: Updater<VisibilityState>) => {
			// Without this, overriding onColumnVisibilityChange bypasses makeStateUpdater,
			// so createSvelteTable's $state never updates and Svelte doesn't re-render.
			table.options.onStateChange?.((old: TableState) => {
				const columnVisibility =
					typeof updater === 'function' ? updater(old.columnVisibility) : updater;

				options.onColumnVisibilityChange?.(columnVisibility);

				return {
					...old,
					columnVisibility
				};
			});
		},
		initialState: {
			columnVisibility: initialColumnVisibility,
			columnSizing: {
				...createColumnSizing(options.columns),
				...options.initialState?.columnSizing
			},
			columnPinning: options.initialState?.columnPinning ?? createColumnPinning(options.columns),
			rowSelection: options.initialState?.rowSelection ?? {},
			sorting: options.initialState?.sorting ?? [],
			columnFilters: options.initialState?.columnFilters ?? []
		}
	});

	return table;
}

function createColumnVisibility<T extends RowData>(columns: DataTableColumn<T>[]) {
	return getLeafColumns(columns).reduce<VisibilityState>((visibility, column) => {
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
): ColumnDef<T>[] {
	return columns.map((column) => {
		if (isGroupColumn(column)) {
			return {
				id: getGroupColumnId(column),
				header: column.header,
				columns: createColumns(column.columns, localeCtx),
				meta: {
					align: column.align
				} satisfies DataTableColumnMeta
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
			sortDescFirst: column.sortDescFirst,
			enableColumnFilter: column.enableColumnFilter,
			...(derivedFilterFn !== undefined ? { filterFn: derivedFilterFn as never } : {}),
			meta: {
				align: column.align,
				type: column.type,
				formatOptions: column.formatOptions,
				formatLocale: column.formatLocale,
				grow: column.grow
			} satisfies DataTableColumnMeta
		} satisfies Partial<ColumnDef<T>>;

		if (typeof column.accessorFn === 'function') {
			return {
				...columnDef,
				accessorFn: column.accessorFn,
				cell: (context) =>
					formatCellValue(column, context.getValue(), context.row.original, localeCtx)
			};
		}

		return {
			...columnDef,
			accessorKey: column.accessorKey,
			cell: (context) =>
				formatCellValue(column, context.getValue(), context.row.original, localeCtx)
		};
	}) as ColumnDef<T>[];
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

const TYPE_DATE_FORMAT_DEFAULTS: Record<'date' | 'time' | 'date-time', Intl.DateTimeFormatOptions> =
	{
		date: { day: '2-digit', month: '2-digit', year: 'numeric' },
		time: { hour: '2-digit', minute: '2-digit' },
		'date-time': {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		}
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

	const numDefaults = column.type ? TYPE_FORMAT_DEFAULTS[column.type] : undefined;
	if (numDefaults !== undefined) {
		const locale = column.formatLocale ?? localeCtx().locale;
		return new Intl.NumberFormat(locale, {
			...numDefaults,
			...(column.formatOptions as Intl.NumberFormatOptions | undefined)
		}).format(Number(value));
	}

	if (column.type === 'date' || column.type === 'time' || column.type === 'date-time') {
		const dateValue = value instanceof Date ? value : new Date(value as string | number);
		if (isNaN(dateValue.getTime())) return undefined;
		const locale = column.formatLocale ?? localeCtx().locale;
		return new Intl.DateTimeFormat(locale, {
			...TYPE_DATE_FORMAT_DEFAULTS[column.type],
			...(column.formatOptions as Intl.DateTimeFormatOptions | undefined)
		}).format(dateValue);
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
