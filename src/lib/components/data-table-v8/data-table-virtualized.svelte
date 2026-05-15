<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/table-core';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { DataTableInstance } from './data-table-utils';
	import DataTableHead from './data-table-head.svelte';
	import DataTableVirtualRows from './data-table-virtual-rows.svelte';
	import {
		getAllRowsSelectionState,
		getReactiveTableState,
		getSelectedRowCount,
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

	let scrollContainerRef = $state<HTMLDivElement | undefined>(undefined);

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
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
	const isMultiRowSelectionEnabled = $derived(table.options.enableMultiRowSelection !== false);
	const headerGroupCount = $derived(headerGroups.length);
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

	<div class="min-h-0 flex-1 overflow-auto" bind:this={scrollContainerRef}>
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style="display: grid; {tableSizeStyle(table, isRowSelectionEnabled)}"
		>
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
				isVirtual
			/>
			{#if scrollContainerRef}
				<DataTableVirtualRows
					rows={rowModel.rows}
					scrollContainer={scrollContainerRef}
					{isRowSelectionEnabled}
					{table}
					{emptyMessage}
					{onRowClick}
					{onRowDoubleClick}
				/>
			{/if}
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
