<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import * as Popover from '../../popover';
	import { PhFunnel, PhFunnelFill } from '#lib/icons';
	import type { DataTableFeatures } from '../features';
	import { cn } from 'tailwind-variants';
	import { getColumnLabel, getColumnMeta, type DataTableInstance } from '../data-table-utils';
	import { ColumnFilterEditing } from '../column-filter-editing.svelte';
	import ColumnFilterEditor from '../filter-editors/column-filter-editor.svelte';

	type Props = {
		table: DataTableInstance<T>;
		column: Column<DataTableFeatures, T, unknown>;
	};

	let { table, column }: Props = $props();

	// Pending edits belong to the table: shared with the other filter hosts, and they still
	// commit after this popover closes.
	const editing = new ColumnFilterEditing({ table: () => table });

	const isFiltered = $derived(
		table.atoms.columnFilters.get().some((filter) => filter.id === column.id)
	);
	const label = $derived(getColumnLabel(column));
	const align = $derived(getColumnMeta(column.columnDef)?.align);

	function clear() {
		editing.cancel(column.id);
		column.setFilterValue(undefined);
	}
</script>

<Popover.Root positioning={{ placement: 'bottom-start' }}>
	<Popover.Trigger
		aria-label={`Filter ${label}`}
		data-active={isFiltered ? '' : undefined}
		class={cn(
			'inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-surface-2 text-ink-dim opacity-0 outline-none group-hover/th:opacity-100 hover:bg-surface-3 hover:text-ink focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring data-[state=open]:opacity-100 pointer-coarse:opacity-100',
			// Floats over the cell's inner edge, opposite the label, so while inactive it never
			// takes width from a narrow column; its background hides label text running under it.
			// Once a filter is set the header cell pads that edge (see data-table-head).
			'absolute top-1/2 -translate-y-1/2',
			align === 'right' ? 'left-1' : 'right-1',
			'data-active:text-primary data-active:opacity-100'
		)}
	>
		{#if isFiltered}
			<PhFunnelFill class="size-3.5" />
		{:else}
			<PhFunnel class="size-3.5" />
		{/if}
	</Popover.Trigger>

	<Popover.Content class="flex w-64 flex-col gap-3 p-3" showArrow={false}>
		<div class="flex min-h-5 items-center justify-between gap-2">
			<Popover.Title class="truncate text-sm font-medium text-ink">{label}</Popover.Title>
			{#if isFiltered}
				<button type="button" onclick={clear} class="text-xs text-primary hover:underline">
					Clear
				</button>
			{/if}
		</div>
		<ColumnFilterEditor {column} {editing} />
	</Popover.Content>
</Popover.Root>
