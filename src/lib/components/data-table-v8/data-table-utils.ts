import type {
	Column,
	Header,
	Row,
	RowData,
	Table,
	TableState,
	VisibilityState
} from '@tanstack/table-core';
import { cn } from 'tailwind-variants';
import type { DataTableColumnMeta } from './types';

export type DataTableInstance<T extends RowData> = Table<T>;

export function getReactiveTableState<T extends RowData>(table: DataTableInstance<T>): TableState {
	return (table as unknown as { _svelteState?: TableState })._svelteState ?? table.getState();
}

export function alignClass(align: DataTableColumnMeta['align']) {
	return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
}

export function justifyClass(align: DataTableColumnMeta['align']) {
	return align === 'right'
		? 'justify-end'
		: align === 'center'
			? 'justify-center'
			: 'justify-start';
}

export function sortButtonDirectionClass(align: DataTableColumnMeta['align']) {
	return align === 'right' ? 'flex-row-reverse' : 'flex-row';
}

export function columnSizeStyle(size: number) {
	return `width: ${size}px`;
}

export function selectionColumnSizeStyle() {
	return 'width: 40px';
}

export function virtualColumnSizeStyle(size: number) {
	return `display: flex; flex: 0 0 ${size}px; width: ${size}px`;
}

export function virtualSelectionColumnSizeStyle() {
	return 'display: flex; flex: 0 0 40px; width: 40px';
}

export function tableSizeStyle<T extends RowData>(
	table: DataTableInstance<T>,
	isRowSelectionEnabled: boolean
) {
	return `width: max(100%, ${table.getTotalSize() + (isRowSelectionEnabled ? 40 : 0)}px)`;
}

export function virtualGrowColumnSizeStyle() {
	return 'display: flex; flex: 1; min-width: 0';
}

export function virtualGroupWithGrowSizeStyle(fixedPortion: number) {
	return `display: flex; flex: 1 0 ${fixedPortion}px; width: ${fixedPortion}px`;
}

export function resizeHandleStyle<T extends RowData>(
	table: DataTableInstance<T>,
	header: Header<T, unknown>
) {
	if (table.options.columnResizeMode !== 'onEnd') return undefined;
	const deltaOffset = table.getState().columnSizingInfo.deltaOffset;
	if (!header.column.getIsResizing() || deltaOffset === null) return undefined;
	return `transform: translateX(${deltaOffset}px)`;
}

export function resizeHandleClass(headerIndex: number, headerCount: number) {
	return cn(
		'absolute top-0 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none before:h-4 before:w-px before:bg-border before:content-[""]',
		headerIndex === headerCount - 1 ? 'right-0' : '-right-1'
	);
}

export function getHeaderSortDirection<T extends RowData>(header: Header<T, unknown>) {
	return header.column.getIsSorted();
}

export function getHeaderSortLabel(sortDirection: false | 'asc' | 'desc') {
	if (sortDirection === 'asc') return 'Sorted ascending';
	if (sortDirection === 'desc') return 'Sorted descending';
	return 'Not sorted';
}

export function getHeaderAriaSort(sortDirection: false | 'asc' | 'desc') {
	if (sortDirection === 'asc') return 'ascending';
	if (sortDirection === 'desc') return 'descending';
	return 'none';
}

export function getAllRowsSelectionState<T extends RowData>(
	table: DataTableInstance<T>
): boolean | 'indeterminate' {
	const allRowsSelected = table.getIsAllRowsSelected();
	const someRowsSelected = table.getIsSomeRowsSelected();
	return allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false;
}

export function getRowSelectionState<T extends RowData>(
	table: DataTableInstance<T>,
	rowId: string
) {
	return table.getRow(rowId).getIsSelected();
}

export function getReactiveCells<T extends RowData>(
	row: Row<T>,
	columnVisibility: VisibilityState
) {
	return row.getAllCells().filter((cell) => columnVisibility[cell.column.id] !== false);
}

export function getSelectedRowCount<T extends RowData>(table: DataTableInstance<T>) {
	return table.getSelectedRowModel().rows.length;
}

export function getBooleanCellValue(value: unknown) {
	if (value === true) return true;
	if (value === false) return false;
	return undefined;
}

export function getPinningStyle<T extends RowData>(
	column: Column<T, unknown>,
	table: DataTableInstance<T>,
	isHeader = false,
	isRowSelectionEnabled = false
): string | undefined {
	const isPinned = column.getIsPinned();
	if (!isPinned) return undefined;

	const zIndex = isHeader ? 15 : 1;
	const selectionOffset = isRowSelectionEnabled ? 40 : 0;

	if (isPinned === 'left') {
		const left = column.getStart('left') + selectionOffset;
		const leftCols = table.getLeftLeafColumns();
		const isLastLeft = leftCols[leftCols.length - 1]?.id === column.id;
		const shadow =
			!isHeader && isLastLeft
				? 'box-shadow: -4px 0 4px -4px var(--compote-border) inset'
				: undefined;
		return ['position: sticky', `z-index: ${zIndex}`, `left: ${left}px`, shadow]
			.filter(Boolean)
			.join('; ');
	} else {
		const right = column.getAfter('right');
		const rightCols = table.getRightLeafColumns();
		const isFirstRight = rightCols[0]?.id === column.id;
		const shadow =
			!isHeader && isFirstRight
				? 'box-shadow: 4px 0 4px -4px var(--compote-border) inset'
				: undefined;
		return ['position: sticky', `z-index: ${zIndex}`, `right: ${right}px`, shadow]
			.filter(Boolean)
			.join('; ');
	}
}

export function getUrlCellValue(value: unknown) {
	if (typeof value !== 'string' || value.trim() === '') return undefined;
	return value;
}

export function openUrlCell(value: string) {
	window.open(value, '_blank', 'noopener,noreferrer');
}

export function getColumnMeta(columnDef: { meta?: unknown }): DataTableColumnMeta | undefined {
	return columnDef.meta as DataTableColumnMeta | undefined;
}

export function joinStyles(...styles: Array<string | undefined>) {
	return styles.filter(Boolean).join('; ');
}
