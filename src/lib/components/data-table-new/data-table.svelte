<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { CellData, Header, RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhCaretDown, PhCaretUp } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { getColumnId, type DataTableFeatures, type DataTableInstance } from './create-table';
	import type { DataTableColumn } from './types';

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

	const rowModel = $derived(table.getRowModel());
	const visibleColumnCount = $derived(table.getVisibleLeafColumns().length);
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	const tableColumnCount = $derived(visibleColumnCount + (isRowSelectionEnabled ? 1 : 0));
	const renderedColumnCount = $derived(tableColumnCount + 1);
	const headerGroupCount = $derived(table.getHeaderGroups().length);
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
		<table class="table-fixed border-collapse text-sm" style={tableSizeStyle()}>
			<colgroup>
				{#if isRowSelectionEnabled}
					<col style={selectionColumnSizeStyle()} />
				{/if}
				{#each table.getVisibleLeafColumns() as column (column.id)}
					<col style={columnSizeStyle(column.getSize())} />
				{/each}
				<col />
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
				{#each table.getHeaderGroups() as headerGroup, headerGroupIndex (headerGroup.id)}
					<tr>
						{#if isRowSelectionEnabled && headerGroupIndex === 0}
							<th
								class="border-b border-surface-3 bg-surface-2 px-3 py-2 text-center align-middle font-medium"
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
						{#each headerGroup.headers as header, headerIndex (header.id)}
							{@const columnDef = columns.find(
								(column) => getColumnId(column) === header.column.id
							)}
							{@const sortDirection = getHeaderSortDirection(header, table.store.state.sorting)}
							<th
								class={cn(
									'relative border-b border-surface-3 bg-surface-2 px-3 py-2 font-medium',
									alignClass(columnDef?.align)
								)}
								colspan={header.colSpan}
								aria-sort={header.column.getCanSort()
									? getHeaderAriaSort(sortDirection)
									: undefined}
							>
								{#if !header.isPlaceholder}
									{#if header.column.getCanSort()}
										<button
											type="button"
											class={cn(
												'inline-flex max-w-full items-center gap-1 rounded-sm outline-none hover:text-ink data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring',
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
										class={resizeHandleClass(headerIndex, headerGroup.headers.length)}
										style={resizeHandleStyle(header)}
										ondblclick={() => header.column.resetSize()}
										onmousedown={header.getResizeHandler()}
										ontouchstart={header.getResizeHandler()}
									></div>
								{/if}
							</th>
						{/each}
						<th aria-hidden="true" class="border-b border-surface-3 bg-surface-2 p-0"></th>
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					{@const rowSelected = getRowSelectionState(table.store.state.rowSelection, row.id)}
					<tr
						class={cn(
							'border-b border-surface-3 last:border-b-0 hover:bg-well/60',
							rowSelected && 'bg-well/60'
						)}
					>
						{#if isRowSelectionEnabled}
							<td class="px-3 py-2 text-center align-middle">
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
							{@const columnDef = columns.find((column) => getColumnId(column) === cell.column.id)}
							<td class={cn('px-3 py-2 text-ink-dim', alignClass(columnDef?.align))}>
								<FlexRender {cell} />
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
