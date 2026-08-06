import type {
	Column,
	ColumnPinningState,
	ColumnSizingState,
	ColumnVisibilityState,
	Header,
	Row,
	RowData,
	SvelteTable,
	TableState
} from '@tanstack/svelte-table';
import { cn } from 'tailwind-variants';
import type { DataTableColumnMeta } from './types';
import type { DataTableFeatures } from './features';

export type DataTableInstance<T extends RowData> = SvelteTable<DataTableFeatures, T>;

// Structural subset of the view state (see table-view-state.svelte.ts) that the
// style helpers below read to register reactive dependencies. Derived table APIs
// (getStart, getSize, …) aren't themselves reactive inside $derived/template
// expressions, so each helper explicitly reads the state slices its output
// depends on.
export type DataTableTrackedState = {
	columnPinning: ColumnPinningState;
	columnResizing: TableState<DataTableFeatures>['columnResizing'];
	columnSizing: ColumnSizingState;
	columnVisibility: ColumnVisibilityState;
};

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
	isRowSelectionEnabled: boolean,
	state: DataTableTrackedState
) {
	void state.columnSizing;
	void state.columnVisibility;
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
	header: Header<DataTableFeatures, T, unknown>,
	columnResizing: TableState<DataTableFeatures>['columnResizing']
) {
	if (table.options.columnResizeMode !== 'onEnd') return undefined;
	const deltaOffset = columnResizing.deltaOffset;
	if (!header.column.getIsResizing() || deltaOffset === null) return undefined;
	return `transform: translateX(${deltaOffset}px)`;
}

export function resizeHandleClass(headerIndex: number, headerCount: number) {
	return cn(
		'absolute top-0 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none before:h-4 before:w-px before:bg-border before:content-[""]',
		headerIndex === headerCount - 1 ? 'right-0' : '-right-1'
	);
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

export function getRowCells<T extends RowData>(
	row: Row<DataTableFeatures, T>,
	state: DataTableTrackedState
) {
	void state.columnVisibility;
	void state.columnPinning;
	void state.columnSizing;
	return [
		...row.getStartVisibleCells(),
		...row.getCenterVisibleCells(),
		...row.getEndVisibleCells()
	];
}

export function getBooleanCellValue(value: unknown) {
	if (value === true) return true;
	if (value === false) return false;
	return undefined;
}

export function getPinningStyle<T extends RowData>(
	column: Column<DataTableFeatures, T, unknown>,
	table: DataTableInstance<T>,
	state: DataTableTrackedState,
	isHeader = false,
	isRowSelectionEnabled = false
): string | undefined {
	void state.columnPinning;
	void state.columnSizing;
	const isPinned = column.getIsPinned();
	if (!isPinned) return undefined;

	const zIndex = isHeader ? 15 : 1;
	const selectionOffset = isRowSelectionEnabled ? 40 : 0;

	if (isPinned === 'start') {
		const left = column.getStart('start') + selectionOffset;
		const leftCols = table.getStartLeafColumns();
		const isLastLeft = leftCols[leftCols.length - 1]?.id === column.id;
		const shadow =
			!isHeader && isLastLeft
				? 'box-shadow: -4px 0 4px -4px var(--compote-border) inset'
				: undefined;
		return ['position: sticky', `z-index: ${zIndex}`, `left: ${left}px`, shadow]
			.filter(Boolean)
			.join('; ');
	} else {
		const right = column.getAfter('end');
		const rightCols = table.getEndLeafColumns();
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

function collectLeafHeaders<T extends RowData>(
	header: Header<DataTableFeatures, T, unknown>
): Header<DataTableFeatures, T, unknown>[] {
	if (header.subHeaders.length === 0) return [header];
	return header.subHeaders.flatMap((sub) => collectLeafHeaders(sub));
}

/**
 * Sticky positioning for a group header whose leaf columns are pinned.
 *
 * A split fragment's subHeaders contain only its own section's children, so the
 * fragment over the pinned columns sticks at the first/last pinned leaf's offset
 * while the fragment over the scrolling columns gets no style.
 */
export function getGroupPinningStyle<T extends RowData>(
	header: Header<DataTableFeatures, T, unknown>,
	section: 'left' | 'center' | 'right' | undefined,
	state: DataTableTrackedState,
	isRowSelectionEnabled = false
): string | undefined {
	void state.columnPinning;
	void state.columnSizing;
	if (section !== 'left' && section !== 'right') return undefined;
	const leafHeaders = collectLeafHeaders(header);

	if (section === 'left') {
		const first = leafHeaders[0];
		if (first?.column.getIsPinned() !== 'start') return undefined;
		const left = first.column.getStart('start') + (isRowSelectionEnabled ? 40 : 0);
		return `position: sticky; z-index: 15; left: ${left}px`;
	}

	const last = leafHeaders[leafHeaders.length - 1];
	if (last?.column.getIsPinned() !== 'end') return undefined;
	return `position: sticky; z-index: 15; right: ${last.column.getAfter('end')}px`;
}

export function getUrlCellValue(value: unknown) {
	if (typeof value !== 'string' || value.trim() === '') return undefined;
	return value;
}

export function openUrlCell(value: string) {
	window.open(value, '_blank', 'noopener,noreferrer');
}

export function getPhoneCellValue(value: unknown) {
	if (typeof value !== 'string' || value.trim() === '') return undefined;
	return value;
}

export function openPhoneCell(value: string) {
	window.location.href = `tel:${value}`;
}

// `columnDef.meta` is natively typed as DataTableColumnMeta via the `columnMeta`
// type-only slot in features.ts; this accessor just narrows the columnDef shape.
export function getColumnMeta(columnDef: {
	meta?: DataTableColumnMeta;
}): DataTableColumnMeta | undefined {
	return columnDef.meta;
}

export function joinStyles(...styles: Array<string | undefined>) {
	return styles.filter(Boolean).join('; ');
}

// Shared with the cell formatter in create-table.svelte.ts — keep number-typed
// columns and their footer sums formatted identically.
export const TYPE_NUMBER_FORMAT_DEFAULTS: Partial<Record<string, Intl.NumberFormatOptions>> = {
	currency: { style: 'currency', currency: 'USD' },
	percent: { style: 'percent' },
	number: {}
};

export function formatColumnFooter(
	meta: DataTableColumnMeta,
	values: unknown[],
	locale: string
): string | undefined {
	if (meta.footer) {
		const result = meta.footer(values);
		if (result === null || result === undefined) return undefined;
		return String(result);
	}
	if (meta.sum) {
		const sum = values.reduce<number>(
			(acc, val) => acc + (typeof val === 'number' ? val : Number(val) || 0),
			0
		);
		const numDefaults = meta.type ? TYPE_NUMBER_FORMAT_DEFAULTS[meta.type] : undefined;
		if (numDefaults !== undefined) {
			return new Intl.NumberFormat(meta.formatLocale ?? locale, {
				...numDefaults,
				...(meta.formatOptions as Intl.NumberFormatOptions | undefined)
			}).format(sum);
		}
		return String(sum);
	}
	return undefined;
}
