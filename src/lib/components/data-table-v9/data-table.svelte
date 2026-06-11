<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { DataTableInstance } from './data-table-utils';
	import { createTableViewState } from './table-view-state.svelte';
	import DataTableHead from './data-table-head.svelte';
	import DataTableFoot from './data-table-foot.svelte';
	import DataTableCellContent from './data-table-cell-content.svelte';
	import {
		alignClass,
		columnSizeStyle,
		getColumnMeta,
		getPinningStyle,
		getRowCells,
		selectionColumnSizeStyle,
		tableSizeStyle
	} from './data-table-utils';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTableInstance<T>;
		caption?: string;
		emptyMessage?: string;
		class?: ClassValue;
		onRowClick?: (details: { row: T; event: MouseEvent }) => void;
		onRowDoubleClick?: (details: { row: T; event: MouseEvent }) => void;
	};

	let {
		table,
		caption,
		emptyMessage = 'No rows found',
		class: className,
		onRowClick,
		onRowDoubleClick,
		...rest
	}: Props = $props();

	const view = createTableViewState(() => table);

	const visibleColumnCount = $derived(view.visibleLeafColumns.length);
	const tableColumnCount = $derived(visibleColumnCount + (view.isRowSelectionEnabled ? 1 : 0));
	const renderedColumnCount = $derived(tableColumnCount + 1);
</script>

<div
	class={cn(
		'flex max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	{#if view.isColumnResizing}
		<div aria-hidden="true" class="fixed inset-0 z-50 cursor-col-resize select-none"></div>
	{/if}

	<div class="min-h-0 flex-1 overflow-auto">
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style={tableSizeStyle(table, view.isRowSelectionEnabled, view)}
		>
			<colgroup>
				{#if view.isRowSelectionEnabled}
					<col style={selectionColumnSizeStyle()} />
				{/if}
				{#each view.visibleLeafColumns as column (column.id)}
					<col
						style={getColumnMeta(column.columnDef)?.grow
							? undefined
							: columnSizeStyle(column.getSize())}
					/>
				{/each}
				{#if !view.hasGrowColumn}
					<col />
				{/if}
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<DataTableHead {table} {view} hasGrowColumn={view.hasGrowColumn} />
			<tbody>
				{#each view.rowModel.rows as row (row.id)}
					{@const rowSelected = view.rowSelection[row.id] === true}
					<tr
						class={cn(
							'group/row',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
							rowSelected &&
								'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
						onclick={(event) => onRowClick?.({ row: row.original, event })}
						ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
					>
						{#if view.isRowSelectionEnabled}
							<td
								class="border-b border-surface-2 bg-(--row-bg) px-3 py-2 text-center align-middle group-last/row:border-b-0"
								style="position: sticky; left: 0; z-index: 1"
								onclick={(event) => event.stopPropagation()}
								ondblclick={(event) => event.stopPropagation()}
							>
								<input
									type="checkbox"
									aria-label="Select row"
									class="table-checkbox mx-auto block size-4"
									checked={rowSelected}
									disabled={!row.getCanSelect()}
									onchange={(e) => row.toggleSelected(e.currentTarget.checked)}
								/>
							</td>
						{/if}
						{#each getRowCells(row, view) as cell (cell.id)}
							{@const meta = getColumnMeta(cell.column.columnDef)}
							<td
								class={cn(
									'truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0',
									alignClass(meta?.align),
									cell.column.getIsPinned() && 'bg-(--row-bg)'
								)}
								style={getPinningStyle(cell.column, table, view, false, view.isRowSelectionEnabled)}
							>
								<DataTableCellContent {cell} />
							</td>
						{/each}
						{#if !view.hasGrowColumn}
							<td aria-hidden="true" class="border-b border-surface-2 p-0 group-last/row:border-b-0"
							></td>
						{/if}
					</tr>
				{:else}
					<tr>
						<td class="px-3 py-10 text-center text-sm text-ink-dim" colspan={renderedColumnCount}>
							{emptyMessage}
						</td>
					</tr>
				{/each}
			</tbody>
			{#if view.hasFooter}
				<DataTableFoot {table} {view} hasGrowColumn={view.hasGrowColumn} />
			{/if}
		</table>
	</div>

	<div class="shrink-0 border-t border-surface-3 bg-surface-2 px-3 py-2 text-sm text-ink-dim">
		{#if view.isRowSelectionEnabled}
			{view.selectedRowCount} of {view.rowModel.rows.length} rows selected
		{:else}
			{view.rowModel.rows.length} rows
		{/if}
	</div>
</div>
