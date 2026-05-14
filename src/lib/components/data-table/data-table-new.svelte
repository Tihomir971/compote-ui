<script lang="ts" generics="T extends RowData">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData } from '@tanstack/svelte-table';
	import type { HTMLAttributes } from 'svelte/elements';
	import { untrack } from 'svelte';
	import { createSubscriber } from 'svelte/reactivity';
	import { cn, type ClassValue } from 'tailwind-variants';
	import { type DataTableInstance } from './create-table';

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

	// createSubscriber: one stable TanStack subscription shared by all deriveds below.
	// Calling subscribeToTable() inside $derived.by declares a Svelte reactive dependency
	// without creating additional TanStack subscriptions per re-run.
	const subscribeToTable = createSubscriber((update) => {
		const sub = table.store.subscribe(() => update());
		return () => sub.unsubscribe();
	});

	const rowModel = $derived(table.getRowModel());
	const headerGroups = $derived(table.getHeaderGroups());

	// rowSelection needs store state — use createSubscriber + untrack to read it
	// without accumulating TanStack subscriptions
	const rowSelection = $derived.by(() => {
		subscribeToTable();
		return untrack(() => table.store.state.rowSelection);
	});
</script>

<div
	class={cn(
		'flex max-h-full min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1',
		className
	)}
	{...rest}
>
	<div class="min-h-0 flex-1 overflow-auto">
		<table class="w-full table-fixed border-separate border-spacing-0 text-sm">
			{#if caption}
				<caption class="sr-only">{caption}</caption>
			{/if}
			<thead>
				{#each headerGroups as headerGroup (headerGroup.id)}
					<tr>
						{#each headerGroup.headers as header (header.id)}
							<th
								class="border-b border-surface-3 bg-surface-2 px-3 py-2 text-left text-xs font-medium text-ink-dim"
								colspan={header.colSpan}
							>
								{#if !header.isPlaceholder}
									<FlexRender {header} />
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>
			<tbody>
				{#each rowModel.rows as row (row.id)}
					{@const isSelected = Boolean(rowSelection[row.id])}
					<tr
						class={cn(
							'group/row',
							'[--row-bg:var(--compote-surface-1)]',
							'hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]',
							isSelected &&
								'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
						)}
						onclick={(event) => onRowClick?.({ row: row.original, event })}
						ondblclick={(event) => onRowDoubleClick?.({ row: row.original, event })}
					>
						{#each row.getVisibleCells() as cell (cell.id)}
							<td class="truncate border-b border-b-surface-2 px-3 py-2 group-last/row:border-b-0">
								<FlexRender {cell} />
							</td>
						{/each}
					</tr>
				{:else}
					<tr>
						<td
							class="px-3 py-10 text-center text-sm text-ink-dim"
							colspan={table.getVisibleLeafColumns().length}
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
