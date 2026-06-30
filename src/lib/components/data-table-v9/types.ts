import type { FilterFnOption, RowData } from '@tanstack/svelte-table';
import type { Component, Snippet } from 'svelte';
import type { DataTableFeatures } from './features';

export type DataTableAlign = 'left' | 'center' | 'right';
export type DataTableColumnType =
	| 'text'
	| 'number'
	| 'currency'
	| 'percent'
	| 'boolean'
	| 'select'
	| 'url'
	| 'phone'
	| 'date'
	| 'time'
	| 'date-time';
export type DataTableCellRenderer<T extends RowData> = (
	value: unknown,
	row: T
) => string | number | boolean | null | undefined;
export type DataTableCellRenderProps<T extends RowData> = {
	value: unknown;
	row: T;
};
export type DataTableCellPropsResolver<T extends RowData> = (
	value: unknown,
	row: T
) => Record<string, unknown>;

export type DataTableColumnOptions<T extends RowData> = {
	size?: number;
	minSize?: number;
	maxSize?: number;
	enableResizing?: boolean;
	enableHiding?: boolean;
	enableSorting?: boolean;
	sortDescFirst?: boolean;
	enableColumnFilter?: boolean;
	filterFn?: FilterFnOption<DataTableFeatures, T>;
};

export type DataTableColumnBase = {
	header: string;
	align?: DataTableAlign;
};

export type DataTableLeafColumnBase<T extends RowData> = DataTableColumnOptions<T> &
	DataTableColumnBase & {
		cell?: DataTableCellRenderer<T>;
		// Component<never> accepts any Svelte component (props are contravariant)
		// while still rejecting non-component values. Without `cellProps`, the
		// component receives DataTableCellRenderProps<T>.
		cellComponent?: Component<DataTableCellRenderProps<T>> | Component<never>;
		cellProps?: DataTableCellPropsResolver<T>;
		cellSnippet?: Snippet<[DataTableCellRenderProps<T>]>;
		type?: DataTableColumnType;
		formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
		formatLocale?: string;
		pinned?: 'left' | 'right';
		grow?: boolean;
		sum?: boolean;
		footer?: (values: unknown[]) => string | number | undefined;
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
	DataTableAccessorKeyColumn<T> | DataTableAccessorFnColumn<T>;

export type DataTableGroupColumn<T extends RowData> = DataTableColumnBase & {
	id?: string;
	columns: DataTableColumn<T>[];
	accessorKey?: never;
	accessorFn?: never;
	cell?: never;
	cellComponent?: never;
	cellProps?: never;
	cellSnippet?: never;
	type?: never;
	formatOptions?: never;
	formatLocale?: never;
};

export type DataTableColumn<T extends RowData> = DataTableLeafColumn<T> | DataTableGroupColumn<T>;

export type DataTableColumnMeta = {
	align?: DataTableAlign;
	type?: DataTableColumnType;
	formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
	formatLocale?: string;
	grow?: boolean;
	sum?: boolean;
	footer?: (values: unknown[]) => string | number | undefined;
};
