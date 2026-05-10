<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { CellData, ColumnPinningPosition, Header, RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCaretDown, PhCaretUp, PhCheck, PhX } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { getColumnId, type DataTableFeatures, type DataTableInstance } from './create-table';
	import type { DataTableColumn, DataTableGroupColumn, DataTableLeafColumn } from './types';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTableInstance<T>;
		columns: DataTableColumn<T>[];
		caption?: string;
		emptyMessage?: string;
		class?: ClassValue;
	};

	let {
		table,
		columns,
		caption,
		emptyMessage = 'No rows found',
		class: className,
		...rest
	}: Props = $props();

	function alignClass(align: DataTableColumn<T>['align']) {
		return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
	}

	function justifyClass(align: DataTableColumn<T>['align']) {
		return align === 'right'
			? 'justify-end'
			: align === 'center'
				? 'justify-center'
				: 'justify-start';
	}

	function sortButtonDirectionClass(align: DataTableColumn<T>['align']) {
		return align === 'right' ? 'flex-row-reverse' : 'flex-row';
	}

	function columnSizeStyle(size: number) {
		return `width: ${size}px`;
	}

	function selectionColumnSizeStyle() {
		return 'width: 40px';
	}

	function tableSizeStyle() {
		return `width: max(100%, ${table.getTotalSize() + (isRowSelectionEnabled ? 40 : 0)}px)`;
	}

	function resizeHandleStyle(header: Header<DataTableFeatures, T, CellData>) {
		if (table.options.columnResizeMode !== 'onEnd') return undefined;
		const deltaOffset = table.store.state.columnResizing.deltaOffset;
		if (!header.column.getIsResizing() || deltaOffset === null) return undefined;
		return `transform: translateX(${deltaOffset}px)`;
	}

	function resizeHandleClass(headerIndex: number, headerCount: number) {
		return cn(
			'absolute top-0 z-10 flex h-full w-2 cursor-col-resize touch-none items-center justify-center select-none before:h-4 before:w-px before:bg-border before:content-[""]',
			headerIndex === headerCount - 1 ? 'right-0' : '-right-1'
		);
	}

	function getHeaderSortDirection(
		header: Header<DataTableFeatures, T, CellData>,
		sortingState: unknown
	) {
		void sortingState;
		return header.column.getIsSorted();
	}

	function getHeaderSortLabel(sortDirection: false | 'asc' | 'desc') {
		if (sortDirection === 'asc') return 'Sorted ascending';
		if (sortDirection === 'desc') return 'Sorted descending';
		return 'Not sorted';
	}

	function getHeaderAriaSort(sortDirection: false | 'asc' | 'desc') {
		if (sortDirection === 'asc') return 'ascending';
		if (sortDirection === 'desc') return 'descending';
		return 'none';
	}

	function getAllRowsSelectionState(rowSelection: unknown) {
		void rowSelection;
		const allRowsSelected = table.getIsAllRowsSelected();
		const someRowsSelected = table.getIsSomeRowsSelected();
		return allRowsSelected ? true : someRowsSelected ? 'indeterminate' : false;
	}

	function getRowSelectionState(rowSelection: unknown, rowId: string) {
		void rowSelection;
		return table.getRow(rowId).getIsSelected();
	}

	function getSelectedRowCount(rowSelection: unknown) {
		void rowSelection;
		return table.getSelectedRowModel().rows.length;
	}

	function getBooleanCellValue(value: unknown) {
		if (value === true) return true;
		if (value === false) return false;
		return undefined;
	}

	//	type PinPosition = 'center' | false | 'left' | 'right';
	function getPinningStyle(
		column: {
			getIsPinned(): ColumnPinningPosition;
			getStart(position?: ColumnPinningPosition): number;
			getAfter(position?: ColumnPinningPosition): number;
			getIsLastColumn(position?: ColumnPinningPosition): boolean;
			getIsFirstColumn(position?: ColumnPinningPosition): boolean;
		},
		isHeader = false
	): string | undefined {
		const isPinned = column.getIsPinned();
		if (!isPinned) return undefined;

		const zIndex = isHeader ? 15 : 1;
		const selectionOffset = isRowSelectionEnabled ? 40 : 0;

		if (isPinned === 'left') {
			const left = column.getStart('left') + selectionOffset;
			const shadow =
				!isHeader && column.getIsLastColumn('left')
					? 'box-shadow: -4px 0 4px -4px var(--compote-border) inset'
					: undefined;
			return ['position: sticky', `z-index: ${zIndex}`, `left: ${left}px`, shadow]
				.filter(Boolean)
				.join('; ');
		} else {
			const right = column.getAfter('right');
			const shadow =
				!isHeader && column.getIsFirstColumn('right')
					? 'box-shadow: 4px 0 4px -4px var(--compote-border) inset'
					: undefined;
			return ['position: sticky', `z-index: ${zIndex}`, `right: ${right}px`, shadow]
				.filter(Boolean)
				.join('; ');
		}
	}

	function getUrlCellValue(value: unknown) {
		if (typeof value !== 'string' || value.trim() === '') return undefined;
		return value;
	}

	function openUrlCell(value: string) {
		window.open(value, '_blank', 'noopener,noreferrer');
	}

	function isGroupColumn(column: DataTableColumn<T>): column is DataTableGroupColumn<T> {
		return Array.isArray(column.columns);
	}

	function isLeafColumn(column: DataTableColumn<T>): column is DataTableLeafColumn<T> {
		return !isGroupColumn(column);
	}

	function findColumnById(
		columnId: string,
		candidates: DataTableColumn<T>[]
	): DataTableColumn<T> | undefined {
		for (const column of candidates) {
			if (isGroupColumn(column)) {
				if ((column.id ?? column.header) === columnId) return column;

				const found = findColumnById(columnId, column.columns);
				if (found) return found;

				continue;
			}

			if (isLeafColumn(column) && getColumnId(column) === columnId) return column;
		}
	}

	const tableStateKey = $derived(JSON.stringify(table.store.state));
	function trackTableState() {
		return tableStateKey;
	}

	const rowModel = $derived.by(() => {
		trackTableState();
		return table.getRowModel();
	});
	const headerGroups = $derived.by(() => {
		trackTableState();
		return table.getHeaderGroups();
	});
	const visibleLeafColumns = $derived.by(() => {
		trackTableState();
		return table.getVisibleLeafColumns();
	});
	const visibleColumnCount = $derived(visibleLeafColumns.length);
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	const tableColumnCount = $derived(visibleColumnCount + (isRowSelectionEnabled ? 1 : 0));
	const renderedColumnCount = $derived(tableColumnCount + 1);
	const headerGroupCount = $derived(headerGroups.length);
	const allRowsSelectionState = $derived(getAllRowsSelectionState(table.store.state.rowSelection));
	const selectedRowCount = $derived(getSelectedRowCount(table.store.state.rowSelection));
	const isColumnResizing = $derived(table.store.state.columnResizing.isResizingColumn !== false);
</script>

<div
	class={cn(
		'flex max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	{#if isColumnResizing}
		<div aria-hidden="true" class="fixed inset-0 z-50 cursor-col-resize select-none"></div>
	{/if}

	<div class="min-h-0 flex-1 overflow-auto">
		<table class="table-fixed border-separate border-spacing-0 text-sm" style={tableSizeStyle()}>
			<colgroup>
				{#if isRowSelectionEnabled}
					<col style={selectionColumnSizeStyle()} />
				{/if}
				{#each visibleLeafColumns as column (column.id)}
					<col style={columnSizeStyle(column.getSize())} />
				{/each}
				<col />
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
				{#each headerGroups as headerGroup, headerGroupIndex (headerGroup.id)}
					{@const visibleHeaders = headerGroup.headers.filter((header) => header.colSpan > 0)}
					<tr class="h-9">
						{#if isRowSelectionEnabled && headerGroupIndex === 0}
							<th
								class="h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 text-center align-middle leading-5 font-medium"
								style="position: sticky; left: 0; z-index: 15"
								rowspan={headerGroupCount}
							>
								{#if isMultiRowSelectionEnabled}
									<Checkbox
										size="sm"
										aria-label="Select all rows"
										class="mx-auto size-4"
										checked={allRowsSelectionState}
										onCheckedChange={({ checked }) => table.toggleAllRowsSelected(checked === true)}
									/>
								{/if}
							</th>
						{/if}
						{#each visibleHeaders as header, headerIndex (header.id)}
							{@const columnDef = findColumnById(header.column.id, columns)}
							{@const sortDirection = getHeaderSortDirection(header, table.store.state.sorting)}
							<th
								class={cn(
									'relative h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium',
									alignClass(columnDef?.align)
								)}
								colspan={header.colSpan}
								aria-sort={header.column.getCanSort()
									? getHeaderAriaSort(sortDirection)
									: undefined}
								style={getPinningStyle(header.column, true)}
							>
								{#if !header.isPlaceholder}
									{#if header.column.getCanSort()}
										<button
											type="button"
											class={cn(
												'inline-flex max-w-full appearance-none items-center gap-1 rounded-sm border-0 bg-transparent p-0 align-middle text-sm leading-5 text-inherit outline-none hover:text-ink data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring',
												justifyClass(columnDef?.align),
												sortButtonDirectionClass(columnDef?.align)
											)}
											aria-label={`${getHeaderSortLabel(sortDirection)}. Toggle sorting.`}
											onclick={header.column.getToggleSortingHandler()}
										>
											<span class="min-w-0 truncate">
												<FlexRender {header} />
											</span>
											<span
												class="inline-flex size-3.5 shrink-0 items-center justify-center text-ink-dim"
											>
												{#if sortDirection === 'asc'}
													<PhCaretUp class="size-3.5" />
												{:else if sortDirection === 'desc'}
													<PhCaretDown class="size-3.5" />
												{/if}
											</span>
										</button>
									{:else}
										<FlexRender {header} />
									{/if}
								{/if}
								{#if header.column.getCanResize()}
									<div
										aria-hidden="true"
										class={resizeHandleClass(headerIndex, visibleHeaders.length)}
										style={resizeHandleStyle(header)}
										ondblclick={() => header.column.resetSize()}
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
									></div>
								{/if}
							</th>
						{/each}
						<th aria-hidden="true" class="h-9 border-b border-surface-3 bg-surface-2 p-0"></th>
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					{@const rowSelected = getRowSelectionState(table.store.state.rowSelection, row.id)}
					<tr
						class={cn(
							'group/row border-b border-surface-3 last:border-b-0',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
							rowSelected &&
								'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
					>
						{#if isRowSelectionEnabled}
							<td
								class="bg-(--row-bg) px-3 py-2 text-center align-middle"
								style="position: sticky; left: 0; z-index: 1"
							>
								<Checkbox
									size="sm"
									aria-label="Select row"
									class="mx-auto size-4"
									checked={rowSelected}
									disabled={!row.getCanSelect()}
									onCheckedChange={({ checked }) => row.toggleSelected(checked === true)}
								/>
							</td>
						{/if}
						{#each row.getVisibleCells() as cell (cell.id)}
							{@const columnDef = findColumnById(cell.column.id, columns)}
							<td
								class={cn(
									'truncate px-3 py-2',
									alignClass(columnDef?.align),
									cell.column.getIsPinned() && 'bg-(--row-bg)'
								)}
								style={getPinningStyle(cell.column)}
							>
								{#if columnDef?.type === 'boolean'}
									{@const value = getBooleanCellValue(cell.getValue())}
									{#if value === true}
										<span
											class="inline-flex size-5 items-center justify-center text-success"
											role="img"
											aria-label="Yes"
										>
											<PhCheck class="size-4" />
										</span>
									{:else if value === false}
										<span
											class="inline-flex size-5 items-center justify-center text-danger"
											role="img"
											aria-label="No"
										>
											<PhX class="size-4" />
										</span>
									{:else}
										-
									{/if}
								{:else if columnDef?.type === 'url'}
									{@const value = getUrlCellValue(cell.getValue())}
									{#if value}
										<button
											type="button"
											class={cn(
												'inline-flex max-w-full appearance-none items-center gap-1.5 rounded-sm border-0 bg-transparent p-0 align-middle leading-5 font-medium text-ink underline decoration-border decoration-dotted underline-offset-4 outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
												justifyClass(columnDef.align)
											)}
											onclick={() => openUrlCell(value)}
										>
											<PhArrowSquareOut class="size-3.5 shrink-0" />
										</button>
									{:else}
										-
									{/if}
								{:else}
									<FlexRender {cell} />
								{/if}
							</td>
						{/each}
						<td aria-hidden="true" class="p-0"></td>
					</tr>
				{:else}
					<tr>
						<td class="px-3 py-10 text-center text-sm text-ink-dim" colspan={renderedColumnCount}>
							{emptyMessage}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="shrink-0 border-t border-surface-3 bg-surface-2 px-3 py-2 text-sm text-ink-dim">
		{#if isRowSelectionEnabled}
			{selectedRowCount} of {rowModel.rows.length} rows selected
		{:else}
			{rowModel.rows.length} rows
		{/if}
	</div>
</div>
