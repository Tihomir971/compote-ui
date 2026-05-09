import type { RowData } from '@tanstack/svelte-table';
import type {
	DataTableAccessorFnColumn,
	DataTableAccessorKeyColumn,
	DataTableColumn,
	DataTableGroupColumn
} from './types';

type AccessorKeyColumnOptions<T extends RowData> = Omit<
	DataTableAccessorKeyColumn<T>,
	'accessorKey' | 'accessorFn' | 'columns'
>;

type AccessorFnColumnOptions<T extends RowData> = Omit<
	DataTableAccessorFnColumn<T>,
	'accessorFn' | 'accessorKey' | 'columns'
>;

type GroupColumnOptions<T extends RowData> = Omit<
	DataTableGroupColumn<T>,
	| 'columns'
	| 'accessorKey'
	| 'accessorFn'
	| 'cell'
	| 'cellComponent'
	| 'cellProps'
	| 'cellSnippet'
	| 'type'
	| 'formatOptions'
	| 'formatLocale'
>;

function urlDefaults<T extends { type?: string; align?: string; enableSorting?: boolean }>(
	options: T
): T {
	if (options.type !== 'url') return options;
	return {
		align: 'center',
		enableSorting: false,
		size: 60,
		...options
	};
}

export function createDataTableColumnHelper<T extends RowData>() {
	return {
		accessor<K extends Extract<keyof T, string>>(
			accessorKey: K,
			options: AccessorKeyColumnOptions<T>
		): DataTableAccessorKeyColumn<T> {
			return {
				...urlDefaults(options),
				accessorKey
			};
		},

		accessorFn(
			accessorFn: (row: T) => unknown,
			options: AccessorFnColumnOptions<T>
		): DataTableAccessorFnColumn<T> {
			return {
				...urlDefaults(options),
				accessorFn
			};
		},

		group(
			header: string,
			columns: DataTableColumn<T>[],
			options: Omit<GroupColumnOptions<T>, 'header'> = {}
		): DataTableGroupColumn<T> {
			return {
				...options,
				header,
				columns
			};
		},

		columns(columns: DataTableColumn<T>[]): DataTableColumn<T>[] {
			return columns;
		}
	};
}
