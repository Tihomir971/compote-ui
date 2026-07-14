import {
	createTable as createSvelteTable,
	type ColumnDef,
	type Column,
	type ColumnPinningState,
	type ColumnResizeMode,
	type ColumnSizingState,
	type ColumnVisibilityState,
	type FilterFn,
	type FilterFnOption,
	type Row,
	type RowData,
	type RowSelectionState
} from '@tanstack/svelte-table';
import { useLocaleContext } from '@ark-ui/svelte/locale';
import { onDestroy, untrack, type Component } from 'svelte';
import { renderComponent, renderSnippet } from '@tanstack/svelte-table';
import { dataTableFeatures, type DataTableFeatures } from './features';
import { TYPE_NUMBER_FORMAT_DEFAULTS, type DataTableInstance } from './data-table-utils';
import type {
	DataTableColumn,
	DataTableColumnType,
	DataTableGroupColumn,
	DataTableLeafColumn,
	DataTableColumnMeta
} from './types';

const oneOfFilterFn: FilterFn<DataTableFeatures, RowData> = (
	row,
	columnId,
	filterValue: string[]
) => {
	return filterValue.includes(String(row.getValue(columnId)));
};
oneOfFilterFn.autoRemove = (val: unknown): boolean => !Array.isArray(val) || val.length === 0;

export type { DataTableInstance };

export type CreateDataTableOptions<T extends RowData> = {
	data: T[];
	columns: DataTableColumn<T>[];
	columnResizeMode?: ColumnResizeMode;
	initialState?: {
		columnVisibility?: ColumnVisibilityState;
		columnSizing?: ColumnSizingState;
		columnPinning?: ColumnPinningState;
		rowSelection?: RowSelectionState;
		sorting?: { id: string; desc: boolean }[];
		columnFilters?: { id: string; value: unknown }[];
	};
	getRowId?: (row: T, index: number, parent?: Row<DataTableFeatures, T>) => string;
	enableRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableMultiRowSelection?: boolean | ((row: Row<DataTableFeatures, T>) => boolean);
	enableSorting?: boolean;
	debugTable?: boolean;
	onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void;
};

export function createTable<T extends RowData>(options: CreateDataTableOptions<T>) {
	const localeCtx = useLocaleContext();

	const initialColumnVisibility = {
		...createColumnVisibility(options.columns),
		...options.initialState?.columnVisibility
	};

	// Recompute the resolved column defs only when the source columns change.
	// $derived keeps the reference stable between changes so TanStack's column
	// memoization isn't invalidated on every access. Pass `columns` through a
	// getter (like `data`) to make adding/removing/reordering columns reactive.
	const columnDefs = $derived(createColumns(options.columns, localeCtx));

	const table = createSvelteTable<DataTableFeatures, T>({
		features: dataTableFeatures,
		get data() {
			return options.data;
		},
		get columns() {
			return columnDefs;
		},
		columnResizeMode: options.columnResizeMode,
		getRowId: options.getRowId,
		enableRowSelection: options.enableRowSelection ?? false,
		enableMultiRowSelection: options.enableMultiRowSelection,
		enableSorting: options.enableSorting,
		// TanStack's default only inspects the FIRST row's value to decide whether a
		// column participates in global search. If that value is null/undefined the
		// column is excluded for the whole table, even when later rows have text.
		// Treat null/undefined as unknown → allow; still exclude non-text values
		// (booleans, objects, arrays) exactly as the default does.
		// Explicit param/return types keep this callback's signature independent of
		// `table` (which it closes over), avoiding a circular type inference. `as
		// never` sidesteps the option's generic-function contextual type — matching
		// the `filterFn as never` pattern above — so it doesn't perturb inference.
		getColumnCanGlobalFilter: ((column: Column<DataTableFeatures, T>): boolean => {
			const value = table
				.getCoreRowModel()
				.flatRows[0]?.getAllCellsByColumnId()
				[column.id]?.getValue();
			return value == null || typeof value === 'string' || typeof value === 'number';
		}) as never,
		debugTable: options.debugTable,
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

	// The svelte adapter's internal $effect.pre only tracks `data` and `state` — not
	// `columns` — so reactive add/remove/reorder of columns never reaches the table.
	// Track the derived column defs here and push them through setOptions ourselves.
	// Re-supply the `data` getter so spreading `prev` doesn't freeze data reactivity.
	// CAUTION: upstream guidance says a second setOptions sync can race the adapter's
	// own $effect.pre (which getter-merges the original options on data/state change).
	// Both syncs write consistent values here, but revisit if the beta adapter ever
	// starts tracking `columns` itself.
	$effect.pre(() => {
		const columns = columnDefs;
		untrack(() => {
			table.setOptions((prev) => ({
				...prev,
				get data() {
					return options.data;
				},
				columns
			}));
		});
	});

	// Notify consumers of visibility changes without taking control of the slice
	// (overriding the table's own `onColumnVisibilityChange` option would suppress
	// internal updates). The atom's `subscribe` is an explicit observer that runs
	// the callback outside Svelte's dependency tracking, so consumer-side reads
	// (e.g. a persisted-state proxy the callback writes into) can never become
	// dependencies that re-trigger the notification — the failure mode of
	// observing via $effect. The initial-replay guard compares by reference:
	// table state updates are immutable, so only the subscription's initial
	// emission (if the atom flavor emits one) can match the snapshot.
	if (options.onColumnVisibilityChange) {
		const initialVisibility = table.atoms.columnVisibility.get();
		const subscription = table.atoms.columnVisibility.subscribe((visibility) => {
			if (visibility === initialVisibility) return;
			options.onColumnVisibilityChange?.(visibility);
		});
		onDestroy(() => subscription.unsubscribe());
	}

	return table;
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
	// Compote exposes `pinned: 'left' | 'right'` publicly; v9 uses logical
	// start/end pinning state, so translate at this boundary.
	return {
		start: leafCols.filter((c) => c.pinned === 'left').map(getColumnId),
		end: leafCols.filter((c) => c.pinned === 'right').map(getColumnId)
	};
}

function createColumns<T extends RowData>(
	columns: DataTableColumn<T>[],
	localeCtx: ReturnType<typeof useLocaleContext>
): ColumnDef<DataTableFeatures, T>[] {
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
			enableHiding: column.enableHiding,
			enableSorting: column.enableSorting,
			sortDescFirst: column.sortDescFirst,
			enableColumnFilter: column.enableColumnFilter,
			...(derivedFilterFn !== undefined ? { filterFn: derivedFilterFn as never } : {}),
			meta: {
				align: column.align,
				type: column.type,
				formatOptions: column.formatOptions,
				formatLocale: column.formatLocale,
				grow: column.grow,
				sum: column.sum,
				footer: column.footer
			} satisfies DataTableColumnMeta
		} satisfies Partial<ColumnDef<DataTableFeatures, T>>;

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
	}) as ColumnDef<DataTableFeatures, T>[];
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

export function getColumnId<T extends RowData>(column: DataTableLeafColumn<T>): string {
	if (column.id !== undefined) return column.id;
	if ('accessorKey' in column && column.accessorKey !== undefined) return column.accessorKey;
	throw new Error('DataTableColumn with accessorFn requires an id.');
}

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

function getFilterFnForType(
	type: DataTableColumnType | undefined
): FilterFnOption<DataTableFeatures, RowData> | undefined {
	switch (type) {
		case 'number':
		case 'currency':
		case 'percent':
			return 'inNumberRange';
		case 'boolean':
			return 'equals';
		case 'select':
			return oneOfFilterFn;
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

	const numDefaults = column.type ? TYPE_NUMBER_FORMAT_DEFAULTS[column.type] : undefined;
	if (numDefaults !== undefined) {
		const numericValue = Number(value);
		if (isNaN(numericValue)) return undefined;
		const locale = column.formatLocale ?? localeCtx().locale;
		return new Intl.NumberFormat(locale, {
			...numDefaults,
			...(column.formatOptions as Intl.NumberFormatOptions | undefined)
		}).format(numericValue);
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
