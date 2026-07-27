import type { RowData } from '@tanstack/svelte-table';
import type {
	DataTableAccessorFnColumn,
	DataTableAccessorKeyColumn,
	DataTableAlign,
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

type TypeDefaults = {
	align?: DataTableAlign;
	size?: number;
	enableSorting?: boolean;
	enableHiding?: boolean;
	enableColumnFilter?: boolean;
};

const TYPE_DEFAULTS: Partial<Record<string, TypeDefaults>> = {
	number: { align: 'right', size: 120 },
	currency: { align: 'right', size: 120 },
	percent: { align: 'right', size: 100 },
	date: { align: 'center', size: 110 },
	time: { align: 'center', size: 80 },
	'date-time': { align: 'center', size: 160 },
	boolean: { align: 'center', size: 90 },
	url: { align: 'center', size: 60, enableSorting: false },
	phone: { align: 'left', size: 160 },
	action: {
		align: 'center',
		size: 60,
		enableSorting: false,
		enableHiding: false,
		enableColumnFilter: false
	}
};

function applyTypeDefaults<T extends { type?: string; align?: string; enableSorting?: boolean }>(
	options: T
): T {
	const defaults = options.type ? TYPE_DEFAULTS[options.type] : undefined;
	if (!defaults) return options;
	return { ...defaults, ...options };
}

export function createDataTableColumnHelper<T extends RowData>() {
	return {
		accessor<K extends Extract<keyof T, string>>(
			accessorKey: K,
			options: AccessorKeyColumnOptions<T>
		): DataTableAccessorKeyColumn<T> {
			return {
				...applyTypeDefaults(options),
				accessorKey
			};
		},

		accessorFn(
			accessorFn: (row: T) => unknown,
			options: AccessorFnColumnOptions<T>
		): DataTableAccessorFnColumn<T> {
			return {
				...applyTypeDefaults(options),
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
