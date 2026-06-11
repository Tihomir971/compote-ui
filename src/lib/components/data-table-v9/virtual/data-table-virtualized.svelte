<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { DataTableInstance } from '../data-table-utils';
	import { createTableViewState } from '../table-view-state.svelte';
	import DataTableHead from '../data-table-head.svelte';
	import DataTableFoot from '../data-table-foot.svelte';
	import DataTableVirtualRows from './data-table-virtual-rows.svelte';
	import { tableSizeStyle } from '../data-table-utils';

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

	const view = createTableViewState(() => table);
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

	<div class="min-h-0 flex-1 overflow-auto" bind:this={scrollContainerRef}>
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style="display: grid; {tableSizeStyle(table, view.isRowSelectionEnabled, view)}"
		>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<DataTableHead {table} {view} isVirtual />
			{#if scrollContainerRef}
				<DataTableVirtualRows
					{table}
					{view}
					scrollContainer={scrollContainerRef}
					{emptyMessage}
					{onRowClick}
					{onRowDoubleClick}
				/>
			{/if}
			{#if view.hasFooter}
				<DataTableFoot {table} {view} hasGrowColumn={false} isVirtual />
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
