export type DataTableAlign = 'left' | 'center' | 'right';

export type DataTableColumn<T> = {
	id: string;
	header: string;
	accessor: keyof T | ((row: T) => unknown);
	cell?: (value: unknown, row: T) => string | number | boolean | null | undefined;
	align?: DataTableAlign;
	size?: number;
	minSize?: number;
	maxSize?: number;
	enableResizing?: boolean;
	width?: string;
};
