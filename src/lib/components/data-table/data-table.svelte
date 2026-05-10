<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhX } from '$lib/icons';
	import Checkbox from '../checkbox/checkbox.svelte';
	import { type DataTableInstance } from './create-table';
	import DataTableHead from './data-table-head.svelte';
	import {
		alignClass,
		columnSizeStyle,
		getAllRowsSelectionState,
		getBooleanCellValue,
		getColumnMeta,
		getPinningStyle,
		getRowSelectionState,
		getSelectedRowCount,
		getUrlCellValue,
		justifyClass,
		openUrlCell,
		selectionColumnSizeStyle,
		tableSizeStyle
	} from './data-table-utils';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		table: DataTableInstance<T>;
		caption?: string;
		emptyMessage?: string;
		class?: ClassValue;
	};

	let {
		table,
		caption,
		emptyMessage = 'No rows found',
		class: className,
		...rest
	}: Props = $props();

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
	const allRowsSelectionState = $derived(
		getAllRowsSelectionState(table, table.store.state.rowSelection)
	);
	const selectedRowCount = $derived(getSelectedRowCount(table, table.store.state.rowSelection));
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
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style={tableSizeStyle(table, isRowSelectionEnabled)}
		>
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
			<DataTableHead
				{table}
				{headerGroups}
				{headerGroupCount}
				{isRowSelectionEnabled}
				{isMultiRowSelectionEnabled}
				{allRowsSelectionState}
			/>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					{@const rowSelected = getRowSelectionState(table, table.store.state.rowSelection, row.id)}
					<tr
						class={cn(
							'group/row',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
							rowSelected &&
								'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
					>
						{#if isRowSelectionEnabled}
							<td
								class="border-b border-surface-2 bg-(--row-bg) px-3 py-2 text-center align-middle group-last/row:border-b-0"
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
							{@const columnDef = getColumnMeta(cell.column.columnDef)}
							<td
								class={cn(
									'truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0',
									alignClass(columnDef?.align),
									cell.column.getIsPinned() && 'bg-(--row-bg)'
								)}
								style={getPinningStyle(cell.column, false, isRowSelectionEnabled)}
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
						<td aria-hidden="true" class="border-b border-surface-2 p-0 group-last/row:border-b-0"
						></td>
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
