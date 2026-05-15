<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhX } from '$lib/icons';
	import type { DataTableInstance } from './data-table-utils';
	import DataTableHead from './data-table-head.svelte';
	import FlexRender from './flex-render.svelte';
	import {
		alignClass,
		columnSizeStyle,
		getBooleanCellValue,
		getColumnMeta,
		getPinningStyle,
		getAllRowsSelectionState,
		getReactiveCells,
		getReactiveTableState,
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

	const tableState = $derived(getReactiveTableState(table));
	const rowModel = $derived.by(() => {
		getReactiveTableState(table);
		return table.getRowModel();
	});
	const headerGroups = $derived.by(() => {
		const { columnVisibility } = getReactiveTableState(table);
		void columnVisibility;
		return table.getHeaderGroups();
	});
	const visibleLeafColumns = $derived.by(() => {
		const { columnVisibility } = getReactiveTableState(table);
		void columnVisibility;
		return table.getVisibleLeafColumns();
	});
	const growColumn = $derived(visibleLeafColumns.find((col) => getColumnMeta(col.columnDef)?.grow));
	const hasGrowColumn = $derived(growColumn !== undefined);
	const visibleColumnCount = $derived(visibleLeafColumns.length);
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	const tableColumnCount = $derived(visibleColumnCount + (isRowSelectionEnabled ? 1 : 0));
	const renderedColumnCount = $derived(tableColumnCount + 1);
	const headerGroupCount = $derived(headerGroups.length);
	const visibleColumnIds = $derived(visibleLeafColumns.map((column) => column.id).join('|'));
	const allRowsSelectionState = $derived.by(() => {
		getReactiveTableState(table);
		return getAllRowsSelectionState(table);
	});
	const selectedRowCount = $derived.by(() => {
		getReactiveTableState(table);
		return getSelectedRowCount(table);
	});
	const isColumnResizing = $derived(tableState.columnSizingInfo.isResizingColumn !== false);
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
					<col
						style={getColumnMeta(column.columnDef)?.grow
							? undefined
							: columnSizeStyle(column.getSize())}
					/>
				{/each}
				{#if !hasGrowColumn}
					<col />
				{/if}
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			{#key visibleColumnIds}
				<DataTableHead
					{table}
					{headerGroups}
					{headerGroupCount}
					{isRowSelectionEnabled}
					{isMultiRowSelectionEnabled}
					{allRowsSelectionState}
					{hasGrowColumn}
				/>
			{/key}
			<tbody>
				{#key visibleColumnIds}
					{#each rowModel.rows as row (row.id)}
						{@const rowSelected = getReactiveTableState(table).rowSelection[row.id] === true}
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
							{#if isRowSelectionEnabled}
								<td
									class="border-b border-surface-2 bg-(--row-bg) px-3 py-2 text-center align-middle group-last/row:border-b-0"
									style="position: sticky; left: 0; z-index: 1"
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
							{#each getReactiveCells(row, getReactiveTableState(table).columnVisibility) as cell (cell.id)}
								{@const columnDef = getColumnMeta(cell.column.columnDef)}
								<td
									class={cn(
										'truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0',
										alignClass(columnDef?.align),
										cell.column.getIsPinned() && 'bg-(--row-bg)'
									)}
									style={getPinningStyle(cell.column, table, false, isRowSelectionEnabled)}
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
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									{/if}
								</td>
							{/each}
							{#if !hasGrowColumn}
								<td
									aria-hidden="true"
									class="border-b border-surface-2 p-0 group-last/row:border-b-0"
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
				{/key}
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
