<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack } from 'svelte';
	import { createSubscriber } from 'svelte/reactivity';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { type DataTableInstance } from './create-table';
	import { getColumnMeta } from './data-table-utils';

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

	const subscribeToTable = createSubscriber((update) => {
		const sub = table.store.subscribe(() => update());
		return () => sub.unsubscribe();
	});

	const rowModel = $derived(table.getRowModel());
	const headerGroups = $derived(table.getHeaderGroups());

	// Column sizing state — protected with createSubscriber + untrack
	const columnSizes = $derived.by(() => {
		subscribeToTable();
		return untrack(() =>
			table.getVisibleLeafColumns().map((col) => ({
				id: col.id,
				size: col.getSize(),
				grow: getColumnMeta(col.columnDef)?.grow ?? false
			}))
		);
	});
	const hasGrowColumn = $derived(columnSizes.some((c) => c.grow));
	const tableWidth = $derived.by(() => {
		subscribeToTable();
		return untrack(() => table.getTotalSize());
	});
	const isRowSelectionEnabled = $derived(Boolean(table.options.enableRowSelection));
</script>

<div
	class={cn(
		'flex max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	<div class="min-h-0 flex-1 overflow-auto">
		<table
			class="table-fixed border-separate border-spacing-0 text-sm"
			style="width: max(100%, {tableWidth + (isRowSelectionEnabled ? 40 : 0)}px)"
		>
			<colgroup>
				{#if isRowSelectionEnabled}
					<col style="width: 40px" />
				{/if}
				{#each columnSizes as col (col.id)}
					<col style={col.grow ? undefined : `width: ${col.size}px`} />
				{/each}
				{#if !hasGrowColumn}
					<col />
				{/if}
			</colgroup>
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
				{#each headerGroups as headerGroup (headerGroup.id)}
					<tr class="h-9">
						{#each headerGroup.headers as header (header.id)}
							<th
								class="h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium"
								colspan={header.colSpan}
							>
								{#if !header.isPlaceholder}
									<FlexRender {header} />
								{/if}
							</th>
						{/each}
						{#if !hasGrowColumn}
							<th aria-hidden="true" class="h-9 border-b border-surface-3 bg-surface-2 p-0"></th>
						{/if}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					<tr
						class={cn(
							'group/row',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
						onclick={(event) => onRowClick?.({ row: row.original, event })}
						ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<td class="truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0">
								<FlexRender {cell} />
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
						<td
							class="px-3 py-10 text-center text-sm text-ink-dim"
							colspan={columnSizes.length + (isRowSelectionEnabled ? 2 : 1)}
						>
							{emptyMessage}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	<div class="shrink-0 border-t border-surface-3 bg-surface-2 px-3 py-2 text-sm text-ink-dim">
		{rowModel.rows.length} rows
	</div>
</div>
