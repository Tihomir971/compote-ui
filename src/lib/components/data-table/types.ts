import type { CellData, ColumnDef, RowData, TableFeatures } from '@tanstack/svelte-table';

export type DataTableAlign = 'left' | 'center' | 'right';
export type DataTableColumnType = 'text' | 'number' | 'currency' | 'percent' | 'boolean' | 'select';
export type DataTableCellRenderer<T extends RowData> = (
	value: unknown,
	row: T
) => string | number | boolean | null | undefined;

export type DataTableColumnOptions<T extends RowData> = Partial<
	Pick<
		ColumnDef<TableFeatures, T, CellData>,
		| 'size'
		| 'minSize'
		| 'maxSize'
		| 'enableResizing'
		| 'enableHiding'
		| 'enableSorting'
		| 'sortDescFirst'
		| 'enableColumnFilter'
		| 'filterFn'
	>
>;

export type DataTableColumnBase = {
	header: string;
	align?: DataTableAlign;
};

export type DataTableLeafColumnBase<T extends RowData> = DataTableColumnOptions<T> &
	DataTableColumnBase & {
		cell?: DataTableCellRenderer<T>;
		type?: DataTableColumnType;
		formatOptions?: Intl.NumberFormatOptions;
		formatLocale?: string;
		columns?: never;
	};

export type DataTableAccessorKeyColumn<T extends RowData> = DataTableLeafColumnBase<T> & {
	accessorKey: Extract<keyof T, string>;
	id?: string;
	accessorFn?: never;
};

export type DataTableAccessorFnColumn<T extends RowData> = DataTableLeafColumnBase<T> & {
	accessorFn: (row: T) => unknown;
	id: string;
	accessorKey?: never;
};

export type DataTableLeafColumn<T extends RowData> =
	| DataTableAccessorKeyColumn<T>
	| DataTableAccessorFnColumn<T>;

export type DataTableGroupColumn<T extends RowData> = DataTableColumnBase & {
	id?: string;
	columns: DataTableColumn<T>[];
	accessorKey?: never;
	accessorFn?: never;
	cell?: never;
	type?: never;
	formatOptions?: never;
	formatLocale?: never;
};

export type DataTableColumn<T extends RowData> = DataTableLeafColumn<T> | DataTableGroupColumn<T>;
