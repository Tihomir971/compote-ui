<script lang="ts" generics="T extends RowData">
	import { onDestroy } from 'svelte';
	import type { Column, RowData } from '@tanstack/svelte-table';
	import * as Popover from '../../popover';
	import * as Tooltip from '../../tooltip';
	import * as ScrollArea from '../../scroll-area';
	import Checkbox from '../../checkbox/checkbox.svelte';
	import { cn } from 'tailwind-variants';
	import type { DataTableInstance } from '../data-table-utils';
	import type { DataTableFeatures } from '../features';
	import NumberInput from '../../number-input/number-input.svelte';
	import * as Field from '../../field';
	import Badge from '../../badge/badge.svelte';
	import { button } from '../../button/button.variants';
	import { PhX, PhMagnifyingGlass, PhFunnel } from '#lib/icons';
	import {
		selectFilterOptions,
		type SelectFilterOption,
		type SelectFilterValue
	} from '#lib/utils/select-filter';
	import { mergeRangeFilter, rangeBounds, type PendingRange } from '#lib/utils/range-filter';
	import { DebouncedFilterEdits } from '#lib/utils/debounced-filter-edit.svelte';
	import { getFilterRevisions } from '../filter-revisions.svelte';

	type Props = {
		table: DataTableInstance<T>;
		/** Text label for the trigger. When omitted, a funnel icon is shown instead. */
		triggerLabel?: string;
	};

	let { table, triggerLabel }: Props = $props();

	// Popover and tooltip share one trigger element, so both must agree on its id.
	const triggerId = $props.id();

	// Debounced edits not committed yet. A control shows its pending edit if there is one,
	// otherwise the column's live filter value — so a filter changed from outside (the app
	// calling setFilterValue / setColumnFilters / resetColumnFilters) never leaves a stale
	// value in the inputs, an edit pending during that change is dropped rather than
	// re-applied, and committing one range bound never restores the other's old value.
	const textEdits = new DebouncedFilterEdits<string>();
	const rangeEdits = new DebouncedFilterEdits<PendingRange>();

	// What an edit is based on: the column's filter revision, which only ever goes up, so a
	// filter cleared and set back to its old value still makes the edit stale. Tables not
	// made by compote's createTable have no revisions; fall back to the filter value.
	const filterRevisions = $derived(getFilterRevisions(table));
	function editBase(column: Column<DataTableFeatures, T, unknown>): unknown {
		return filterRevisions ? filterRevisions.get(column.id) : column.getFilterValue();
	}

	let localSelectSearch: Record<string, string> = $state({});

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

	onDestroy(() => {
		textEdits.cancelAll();
		rangeEdits.cancelAll();
	});

	function getColumnType(column: Column<DataTableFeatures, T, unknown>): string | undefined {
		return (column.columnDef.meta as Record<string, unknown> | undefined)?.type as
			string | undefined;
	}

	function getColumnLabel(column: Column<DataTableFeatures, T, unknown>): string {
		return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
	}

	function addFilter(column: Column<DataTableFeatures, T, unknown>) {
		manualFilterIds = [...manualFilterIds, column.id];
		showColumnPicker = false;
		columnSearchText = '';
	}

	function removeFilter(column: Column<DataTableFeatures, T, unknown>) {
		manualFilterIds = manualFilterIds.filter((id) => id !== column.id);
		textEdits.cancel(column.id);
		rangeEdits.cancel(column.id);
		column.setFilterValue(undefined);
		delete localSelectSearch[column.id];
	}

	function clearFilters() {
		textEdits.cancelAll();
		rangeEdits.cancelAll();
		localSelectSearch = {};
		manualFilterIds = [];
		showColumnPicker = false;
		columnSearchText = '';
		table.resetColumnFilters();
	}

	function getTextValue(column: Column<DataTableFeatures, T, unknown>): string {
		const value = column.getFilterValue();
		return textEdits.get(column.id, editBase(column)) ?? (typeof value === 'string' ? value : '');
	}

	/**
	 * Whether `column` still has a filter card. A card torn down by an outside change can
	 * still emit — Ark's NumberInput commits the typed number on the blur its unmount
	 * triggers — and that must not write back a filter the app just cleared.
	 */
	function isCardActive(column: Column<DataTableFeatures, T, unknown>): boolean {
		return activeFilterIds.includes(column.id);
	}

	function handleTextInput(column: Column<DataTableFeatures, T, unknown>, value: string) {
		if (!isCardActive(column)) return;
		textEdits.edit(
			column.id,
			editBase(column),
			() => value,
			() => editBase(column),
			(text) => column.setFilterValue(text || undefined)
		);
	}

	function getRangeBound(
		column: Column<DataTableFeatures, T, unknown>,
		which: 'min' | 'max'
	): number | null {
		const value = column.getFilterValue();
		const pending = rangeEdits.get(column.id, editBase(column));
		if (pending && which in pending) return pending[which] ?? null;
		return rangeBounds(value)[which === 'min' ? 0 : 1] ?? null;
	}

	function handleNumericInput(
		column: Column<DataTableFeatures, T, unknown>,
		which: 'min' | 'max',
		value: number | null
	) {
		if (!isCardActive(column)) return;
		rangeEdits.edit(
			column.id,
			editBase(column),
			(pending) => ({ ...pending, [which]: value }),
			() => editBase(column),
			(pending) => column.setFilterValue(mergeRangeFilter(column.getFilterValue(), pending))
		);
	}

	function getSelectValues(column: Column<DataTableFeatures, T, unknown>): SelectFilterValue[] {
		return (column.getFilterValue() as SelectFilterValue[] | undefined) ?? [];
	}

	function handleSelectChange(
		column: Column<DataTableFeatures, T, unknown>,
		value: SelectFilterValue,
		checked: boolean
	) {
		const current = getSelectValues(column);
		const next = checked ? [...current, value] : current.filter((v) => v !== value);
		column.setFilterValue(next.length ? next : undefined);
	}

	function getSelectOptions(column: Column<DataTableFeatures, T, unknown>): SelectFilterOption[] {
		return selectFilterOptions(column.getFacetedUniqueValues());
	}

	function getFacetedMinMax(
		column: Column<DataTableFeatures, T, unknown>
	): [number | undefined, number | undefined] {
		const vals = column.getFacetedMinMaxValues();
		return vals ? [vals[0] as number, vals[1] as number] : [undefined, undefined];
	}

	function getColumnFormatOptions(
		column: Column<DataTableFeatures, T, unknown>
	): Intl.NumberFormatOptions | undefined {
		return (column.columnDef.meta as Record<string, unknown> | undefined)?.formatOptions as
			Intl.NumberFormatOptions | undefined;
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
			<span class="text-sm font-medium text-ink">Filters</span>
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

									{#if getColumnType(column) === 'number' || getColumnType(column) === 'currency' || getColumnType(column) === 'percent'}
										{@const [facetMin, facetMax] = getFacetedMinMax(column)}
										{@const colFormatOptions = getColumnFormatOptions(column)}
										<div class="flex flex-col gap-1.5">
											<div class="min-w-0 flex-1">
												<NumberInput
													layout="horizontal"
													label="From"
													bind:value={
														() => getRangeBound(column, 'min'),
														(bound) => handleNumericInput(column, 'min', bound ?? null)
													}
													min={facetMin}
													max={facetMax}
													formatOptions={colFormatOptions}
												/>
											</div>
											<div class="min-w-0 flex-1">
												<NumberInput
													layout="horizontal"
													label="To"
													bind:value={
														() => getRangeBound(column, 'max'),
														(bound) => handleNumericInput(column, 'max', bound ?? null)
													}
													min={facetMin}
													max={facetMax}
													formatOptions={colFormatOptions}
												/>
											</div>
										</div>
									{:else if getColumnType(column) === 'boolean'}
										{@const boolFilter = column.getFilterValue() as boolean | undefined}
										<div class="flex overflow-hidden rounded border border-border text-xs">
											<button
												type="button"
												onclick={() => column.setFilterValue(undefined)}
												class={cn(
													'flex-1 px-2 py-1',
													boolFilter === undefined
														? 'bg-surface-3 font-medium text-ink'
														: 'text-ink-dim hover:bg-surface-2'
												)}
											>
												All
											</button>
											<button
												type="button"
												onclick={() =>
													column.setFilterValue(boolFilter === true ? undefined : true)}
												class={cn(
													'flex-1 border-x border-border px-2 py-1',
													boolFilter === true
														? 'bg-surface-3 font-medium text-ink'
														: 'text-ink-dim hover:bg-surface-2'
												)}
											>
												Yes
											</button>
											<button
												type="button"
												onclick={() =>
													column.setFilterValue(boolFilter === false ? undefined : false)}
												class={cn(
													'flex-1 px-2 py-1',
													boolFilter === false
														? 'bg-surface-3 font-medium text-ink'
														: 'text-ink-dim hover:bg-surface-2'
												)}
											>
												No
											</button>
										</div>
									{:else if getColumnType(column) === 'select'}
										{@const allOptions = getSelectOptions(column)}
										{@const search = localSelectSearch[column.id] ?? ''}
										{@const options = search
											? allOptions.filter((o) =>
													o.label.toLowerCase().includes(search.toLowerCase())
												)
											: allOptions}
										{@const selected = getSelectValues(column)}
										<div class="flex flex-col gap-1">
											<Field.Root hideMessageLine>
												<Field.Input
													placeholder="Search..."
													value={search}
													oninput={(e: Event) => {
														localSelectSearch[column.id] = (
															e.currentTarget as HTMLInputElement
														).value;
													}}
												/>
											</Field.Root>
											<ScrollArea.Root>
												<ScrollArea.Viewport class="max-h-40">
													<ScrollArea.Content>
														<div class="flex flex-col gap-0.5">
															{#each options as option (option.value)}
																<div
																	class="flex min-h-7 items-center gap-2 rounded-sm pr-2 hover:bg-surface-2"
																>
																	<Checkbox
																		size="sm"
																		label={option.label}
																		class="min-h-7 flex-1 px-2"
																		checked={selected.includes(option.value)}
																		onCheckedChange={({ checked }) =>
																			handleSelectChange(column, option.value, checked === true)}
																	/>
																	<span class="text-xs text-ink-dim tabular-nums"
																		>{option.count}</span
																	>
																</div>
															{/each}
														</div>
													</ScrollArea.Content>
												</ScrollArea.Viewport>
												<ScrollArea.Scrollbar orientation="vertical">
													<ScrollArea.Thumb />
												</ScrollArea.Scrollbar>
												<ScrollArea.Corner />
											</ScrollArea.Root>
										</div>
									{:else}
										<Field.Root hideMessageLine>
											<Field.Input
												placeholder="Search..."
												bind:value={
													() => getTextValue(column),
													(text) => handleTextInput(column, String(text ?? ''))
												}
											/>
										</Field.Root>
									{/if}
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
