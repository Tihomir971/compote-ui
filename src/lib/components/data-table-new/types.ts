import type { CellData, ColumnDef, RowData, TableFeatures } from '@tanstack/svelte-table';

export type DataTableAlign = 'left' | 'center' | 'right';
export type DataTableCellRenderer<T extends RowData> = (
	value: unknown,
	row: T
) => string | number | boolean | null | undefined;

type DataTableColumnOptions<T extends RowData> = Partial<
	Pick<
		ColumnDef<TableFeatures, T, CellData>,
		| 'size'
		| 'minSize'
		| 'maxSize'
		| 'enableResizing'
		| 'enableHiding'
		| 'enableSorting'
		| 'sortDescFirst'
	>
>;

export type DataTableColumn<T extends RowData> = DataTableColumnOptions<T> & {
	header: string;
	cell?: DataTableCellRenderer<T>;
	align?: DataTableAlign;
} & (
		| {
				accessorKey: Extract<keyof T, string>;
				id?: string;
				accessorFn?: never;
		  }
		| {
				accessorFn: (row: T) => unknown;
				id: string;
				accessorKey?: never;
		  }
	);
