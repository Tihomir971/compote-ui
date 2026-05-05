import type {
	AccessorFnColumnDef,
	AccessorKeyColumnDef,
	Cell,
	CellData,
	ColumnDef,
	DisplayColumnDef,
	FilterFn,
	GroupColumnDef,
	RowData
} from '@tanstack/svelte-table';

import type { DataTableFeatures } from './create-table.svelte';

type NumericFormat = {
	locale?: string;
	minimumFractionDigits?: number;
	maximumFractionDigits?: number;
	fractionDigits?: number;
};

export type DataTableCellConfig<TData extends RowData = RowData, TValue = unknown> =
	| ({ type: 'text' } & {
			fallback?: string;
	  })
	| ({ type: 'number' } & NumericFormat)
	| ({
			type: 'currency';
			currency: string;
			currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay'];
	  } & NumericFormat)
	| ({ type: 'percentage' } & NumericFormat)
	| {
			type: 'boolean';
			trueLabel?: string;
			falseLabel?: string;
			nullLabel?: string;
	  }
	| {
			type: 'link';
			href?: string | ((value: TValue, row: TData) => string);
			target?: HTMLAnchorElement['target'];
			fallback?: string;
	  };

export type DataTableCellType<TData extends RowData = RowData, TValue = unknown> =
	| DataTableCellConfig<TData, TValue>
	| Exclude<DataTableCellConfig<TData, TValue>['type'], 'currency' | 'link'>;

export type DataTableColumnMeta<TData extends RowData = RowData, TValue = unknown> = {
	dataTable?: {
		align?: DataTableColumnAlign;
		cell?: DataTableCellConfig<TData, TValue>;
		filter?: DataTableFilterConfig<TValue>;
		hasCustomCell?: boolean;
	};
};

export type DataTableColumnAlign = 'left' | 'center' | 'right';

export type DataTableFilterOption<TValue = unknown> = {
	label: string;
	value: TValue;
};

export type DataTableFilterConfig<TValue = unknown> =
	| {
			type: 'text';
			placeholder?: string;
	  }
	| {
			type: 'facet';
			options?: DataTableFilterOption<TValue>[];
			maxOptions?: number;
	  }
	| {
			type: 'number-range';
			min?: number;
			max?: number;
			step?: number;
			formatOptions?: Intl.NumberFormatOptions;
	  }
	| {
			type: 'boolean';
			trueLabel?: string;
			falseLabel?: string;
	  };

export type DataTableFilterType<TValue = unknown> =
	| DataTableFilterConfig<TValue>
	| DataTableFilterConfig<TValue>['type'];

type DataTableColumnDefOptions<TData extends RowData, TValue> = {
	align?: DataTableColumnAlign;
	cellType?: DataTableCellType<TData, TValue>;
	filter?: DataTableFilterType<TValue>;
};

export type DataTableColumnDef<TData extends RowData, TValue extends CellData = CellData> =
	| (AccessorKeyColumnDef<DataTableFeatures, TData, TValue> &
			DataTableColumnDefOptions<TData, TValue>)
	| (AccessorFnColumnDef<DataTableFeatures, TData, TValue> &
			DataTableColumnDefOptions<TData, TValue>)
	| (DisplayColumnDef<DataTableFeatures, TData, TValue> & DataTableColumnDefOptions<TData, TValue>)
	| (Omit<GroupColumnDef<DataTableFeatures, TData, TValue>, 'columns'> &
			DataTableColumnDefOptions<TData, TValue> & {
				columns?: DataTableColumnDef<TData, CellData>[];
			});

export type DataTableCell<TData extends RowData = RowData, TValue = unknown> = Cell<
	DataTableFeatures,
	TData,
	TValue
>;

export function getDataTableCellConfig<TData extends RowData, TValue>(
	cell: DataTableCell<TData, TValue>
): DataTableCellConfig<TData, TValue> | undefined {
	return (cell.column.columnDef.meta as DataTableColumnMeta<TData, TValue> | undefined)?.dataTable
		?.cell;
}

export function getDataTableFilterConfig<TData extends RowData, TValue>(
	columnDef: ColumnDef<DataTableFeatures, TData, TValue>
): DataTableFilterConfig<TValue> | undefined {
	return (columnDef.meta as DataTableColumnMeta<TData, TValue> | undefined)?.dataTable?.filter;
}

export function hasCustomDataTableCell<TData extends RowData, TValue>(
	cell: DataTableCell<TData, TValue>
): boolean {
	return (
		(cell.column.columnDef.meta as DataTableColumnMeta<TData, TValue> | undefined)?.dataTable
			?.hasCustomCell ?? false
	);
}

export function normalizeDataTableColumns<TData extends RowData>(
	columns: DataTableColumnDef<TData>[]
): ColumnDef<DataTableFeatures, TData, CellData>[] {
	return columns.map((columnDef) => {
		const {
			cellType,
			filter,
			align,
			columns: childColumns,
			meta,
			...column
		} = columnDef as DataTableColumnDef<TData> & {
			columns?: DataTableColumnDef<TData>[];
		};
		const cell = normalizeDataTableCellType(cellType);
		const filterConfig = normalizeDataTableFilterType(filter);
		const hasCustomCell = 'cell' in column;
		const filterFn =
			'filterFn' in column ? column.filterFn : getDefaultDataTableFilterFn(filterConfig);
		const nextMeta =
			cell || align || filterConfig
				? {
						...(meta ?? {}),
						dataTable: {
							...((meta as DataTableColumnMeta<TData> | undefined)?.dataTable ?? {}),
							...(align ? { align } : {}),
							...(cell ? { cell } : {}),
							...(filterConfig ? { filter: filterConfig } : {}),
							hasCustomCell
						}
					}
				: meta;

		return {
			...column,
			...(childColumns ? { columns: normalizeDataTableColumns(childColumns) } : {}),
			...(filterFn ? { filterFn } : {}),
			...(nextMeta ? { meta: nextMeta } : {})
		} as ColumnDef<DataTableFeatures, TData, CellData>;
	});
}

function normalizeDataTableCellType<TData extends RowData, TValue>(
	cellType: DataTableCellType<TData, TValue> | undefined
): DataTableCellConfig<TData, TValue> | undefined {
	if (!cellType) return undefined;
	return typeof cellType === 'string' ? { type: cellType } : cellType;
}

function normalizeDataTableFilterType<TValue>(
	filter: DataTableFilterType<TValue> | undefined
): DataTableFilterConfig<TValue> | undefined {
	if (!filter) return undefined;
	return typeof filter === 'string' ? { type: filter } : filter;
}

function getDefaultDataTableFilterFn<TValue>(filter: DataTableFilterConfig<TValue> | undefined) {
	if (!filter) return undefined;

	if (filter.type === 'facet') return dataTableFacetFilter;
	if (filter.type === 'number-range') return 'inNumberRange';
	if (filter.type === 'boolean') return 'equals';
	return 'includesString';
}

const dataTableFacetFilter: FilterFn<DataTableFeatures, RowData> = (row, columnId, filterValue) => {
	if (!Array.isArray(filterValue) || filterValue.length === 0) return true;
	const value = row.getValue(columnId);
	return filterValue.some((filterItem) => Object.is(filterItem, value));
};

dataTableFacetFilter.autoRemove = (filterValue) =>
	!Array.isArray(filterValue) || filterValue.length === 0;
