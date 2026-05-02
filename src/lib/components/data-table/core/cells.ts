import type {
	AccessorFnColumnDef,
	AccessorKeyColumnDef,
	Cell,
	CellData,
	ColumnDef,
	DisplayColumnDef,
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
			href: string | ((value: TValue, row: TData) => string);
			target?: HTMLAnchorElement['target'];
			fallback?: string;
	  };

export type DataTableCellType<TData extends RowData = RowData, TValue = unknown> =
	| DataTableCellConfig<TData, TValue>
	| Exclude<DataTableCellConfig<TData, TValue>['type'], 'currency' | 'link'>;

export type DataTableColumnMeta<TData extends RowData = RowData, TValue = unknown> = {
	dataTable?: {
		cell?: DataTableCellConfig<TData, TValue>;
		hasCustomCell?: boolean;
	};
};

type DataTableColumnDefOptions<TData extends RowData, TValue> = {
	cellType?: DataTableCellType<TData, TValue>;
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
			columns: childColumns,
			meta,
			...column
		} = columnDef as DataTableColumnDef<TData> & {
			columns?: DataTableColumnDef<TData>[];
		};
		const cell = normalizeDataTableCellType(cellType);
		const hasCustomCell = 'cell' in column;
		const nextMeta = cell
			? {
					...(meta ?? {}),
					dataTable: {
						...((meta as DataTableColumnMeta<TData> | undefined)?.dataTable ?? {}),
						cell,
						hasCustomCell
					}
				}
			: meta;

		return {
			...column,
			...(childColumns ? { columns: normalizeDataTableColumns(childColumns) } : {}),
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
