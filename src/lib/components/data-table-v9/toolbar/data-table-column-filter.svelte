<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import * as Popover from '../../popover';
	import * as Tooltip from '../../tooltip';
	import * as ScrollArea from '../../scroll-area';
	import { getColumnLabel, type DataTableInstance } from '../data-table-utils';
	import type { DataTableFeatures } from '../features';
	import Badge from '../../badge/badge.svelte';
	import { button } from '../../button/button.variants';
	import { PhX, PhMagnifyingGlass, PhFunnel } from '#lib/icons';
	import { ColumnFilterEditing } from '../column-filter-editing.svelte';
	import ColumnFilterEditor from '../filter-editors/column-filter-editor.svelte';

	type Props = {
		table: DataTableInstance<T>;
		/** Text label for the trigger. When omitted, a funnel icon is shown instead. */
		triggerLabel?: string;
	};

	let { table, triggerLabel }: Props = $props();

	// Popover and tooltip share one trigger element, so both must agree on its id.
	const triggerId = $props.id();

	// Pending edits belong to the table: shared with the other filter hosts, and they still
	// commit after this popover closes.
	const editing = new ColumnFilterEditing({
		table: () => table,
		isActive: (columnId) => activeFilterIds.includes(columnId)
	});

	const columnFilters = $derived.by(() => table.atoms.columnFilters.get());
	const columnVisibility = $derived.by(() => table.atoms.columnVisibility.get());
	const activeCount = $derived(columnFilters.length);

	// Filters the user has explicitly opened. Kept separate from the table's
	// columnFilters so a filter card stays visible after its value is cleared
	// (e.g. unchecking the last select option) until removed via the X button.
	let manualFilterIds = $state<string[]>([]);
	const activeFilterIds: string[] = $derived.by(() => {
		const ids = columnFilters.map((f) => f.id);
		for (const id of manualFilterIds) {
			if (!ids.includes(id)) ids.push(id);
		}
		return ids;
	});
	let showColumnPicker = $state(false);
	let columnSearchText = $state('');

	const activeColumns = $derived.by(() => {
		return activeFilterIds
			.map((id) => table.getColumn(id))
			.filter((col): col is Column<DataTableFeatures, T, unknown> => col != null);
	});

	const availableColumns = $derived.by(() => {
		void columnVisibility;
		return table
			.getAllLeafColumns()
			.filter((col) => col.getCanFilter() && !activeFilterIds.includes(col.id))
			.filter(
				(col) =>
					!columnSearchText ||
					getColumnLabel(col).toLowerCase().includes(columnSearchText.toLowerCase())
			);
	});

	function addFilter(column: Column<DataTableFeatures, T, unknown>) {
		manualFilterIds = [...manualFilterIds, column.id];
		showColumnPicker = false;
		columnSearchText = '';
	}

	function removeFilter(column: Column<DataTableFeatures, T, unknown>) {
		manualFilterIds = manualFilterIds.filter((id) => id !== column.id);
		editing.cancel(column.id);
		column.setFilterValue(undefined);
	}

	function clearFilters() {
		editing.cancelAll();
		manualFilterIds = [];
		showColumnPicker = false;
		columnSearchText = '';
		table.resetColumnFilters();
	}
</script>

<Popover.Root ids={{ trigger: triggerId }} positioning={{ placement: 'bottom-end' }}>
	<Tooltip.Root ids={{ trigger: triggerId }} disabled={!!triggerLabel}>
		<Tooltip.Trigger>
			{#snippet asChild(tooltipProps)}
				<Popover.Trigger
					{...tooltipProps()}
					aria-label={triggerLabel ? undefined : 'Filters'}
					class={button({
						variant: 'outline',
						size: triggerLabel ? 'default' : 'icon',
						class: 'relative'
					})}
				>
					{#if triggerLabel}
						{triggerLabel}
					{:else}
						<PhFunnel />
					{/if}
					{#if activeCount > 0}
						<Badge
							variant="solid"
							color="primary"
							class="absolute top-0 right-0 size-4 translate-x-1/3 -translate-y-1/3 justify-center px-1 text-xs"
						>
							{activeCount > 99 ? '99+' : activeCount}
						</Badge>
					{/if}
				</Popover.Trigger>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>Filters</Tooltip.Content>
	</Tooltip.Root>

	<Popover.Content class="flex w-70 flex-col gap-3 p-3" showArrow={false}>
		<div class="mr-1 flex items-center justify-between py-2.5">
			<Popover.Title class="text-sm font-medium text-ink">Filters</Popover.Title>
			{#if activeCount > 0}
				<button type="button" onclick={clearFilters} class="text-xs text-primary hover:underline">
					Clear all
				</button>
			{/if}
		</div>

		{#if activeColumns.length > 0}
			<div class="overflow-hidden border-t border-surface-2">
				<ScrollArea.Root>
					<ScrollArea.Viewport class="max-h-96">
						<ScrollArea.Content class="flex flex-col gap-3">
							{#each activeColumns as column (column.id)}
								<div class="border border-surface-3 p-3">
									<div class="mb-2 flex items-center justify-between">
										<span class="text-sm font-medium text-ink">{getColumnLabel(column)}</span>
										<button
											type="button"
											onclick={() => removeFilter(column)}
											class="text-ink-dim transition-colors hover:text-ink"
										>
											<PhX class="size-3.5" />
										</button>
									</div>

									<ColumnFilterEditor {column} {editing} />
								</div>
							{/each}
						</ScrollArea.Content>
					</ScrollArea.Viewport>
					<ScrollArea.Scrollbar orientation="vertical">
						<ScrollArea.Thumb />
					</ScrollArea.Scrollbar>
					<ScrollArea.Corner />
				</ScrollArea.Root>
			</div>
		{/if}

		{#if showColumnPicker}
			<div class="border-t border-surface-3 p-3">
				<div class="relative mb-1">
					<PhMagnifyingGlass
						class="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-ink-dim"
					/>
					<input
						type="text"
						placeholder="Search columns..."
						bind:value={columnSearchText}
						class="h-8 w-full rounded border border-border bg-surface-1 pr-3 pl-7 text-sm text-ink outline-none placeholder:text-ink-dim focus:ring-1 focus:ring-ring"
					/>
				</div>
				<div class="max-h-48 overflow-y-auto">
					{#each availableColumns as column (column.id)}
						<button
							type="button"
							onclick={() => addFilter(column)}
							class="w-full rounded px-2 py-1.5 text-left text-sm text-ink hover:bg-surface-2"
						>
							{getColumnLabel(column)}
						</button>
					{:else}
						<p class="px-2 py-3 text-center text-sm text-ink-dim">No more columns</p>
					{/each}
				</div>
			</div>
		{:else}
			<div class="border-t border-surface-3">
				<button
					type="button"
					onclick={() => (showColumnPicker = true)}
					class="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-ink-dim hover:bg-surface-2 hover:text-ink"
				>
					<span class="text-base leading-none">+</span>
					Add Filter
				</button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
