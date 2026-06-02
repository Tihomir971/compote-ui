<script lang="ts" generics="T extends RowData">
	import { onDestroy } from 'svelte';
	import type { Column, RowData } from '@tanstack/table-core';
	import * as Popover from '../../popover';
	import * as ScrollArea from '../../scroll-area';
	import Checkbox from '../../checkbox/checkbox.svelte';
	import { cn } from 'tailwind-variants';
	import { getReactiveTableState, type DataTableInstance } from '../data-table-utils';
	import NumberInput from '../../number-input/number-input.svelte';
	import * as Field from '../../field';
	import { PhX, PhMagnifyingGlass } from '$lib/icons';

	type Props = {
		table: DataTableInstance<T>;
		triggerLabel?: string;
	};

	let { table, triggerLabel = 'Filters' }: Props = $props();

	let localText: Record<string, string> = $state({});
	let localNumMin: Record<string, number> = $state({});
	let localNumMax: Record<string, number> = $state({});
	let localSelectSearch: Record<string, string> = $state({});
	const timers: Record<string, ReturnType<typeof setTimeout>> = {};

	const columnFilters = $derived(getReactiveTableState(table).columnFilters);
	const activeCount = $derived(columnFilters.length);

	let activeFilterIds: string[] = $derived(columnFilters.map((f) => f.id));
	let showColumnPicker = $state(false);
	let columnSearchText = $state('');

	const activeColumns = $derived.by(() => {
		getReactiveTableState(table);
		return activeFilterIds
			.map((id) => table.getColumn(id))
			.filter((col): col is Column<T, unknown> => col != null);
	});

	const availableColumns = $derived.by(() => {
		getReactiveTableState(table);
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
		Object.values(timers).forEach(clearTimeout);
	});

	function getColumnType(column: Column<T, unknown>): string | undefined {
		return (column.columnDef.meta as Record<string, unknown> | undefined)?.type as
			| string
			| undefined;
	}

	function getColumnLabel(column: Column<T, unknown>): string {
		return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
	}

	function addFilter(column: Column<T, unknown>) {
		activeFilterIds = [...activeFilterIds, column.id];
		showColumnPicker = false;
		columnSearchText = '';
	}

	function removeFilter(column: Column<T, unknown>) {
		activeFilterIds = activeFilterIds.filter((id) => id !== column.id);
		column.setFilterValue(undefined);
		delete localText[column.id];
		delete localNumMin[column.id];
		delete localNumMax[column.id];
		delete localSelectSearch[column.id];
		clearTimeout(timers[column.id]);
		clearTimeout(timers[`${column.id}_min`]);
		clearTimeout(timers[`${column.id}_max`]);
	}

	function clearFilters() {
		Object.values(timers).forEach(clearTimeout);
		for (const key of Object.keys(timers)) delete timers[key];
		localText = {};
		localNumMin = {};
		localNumMax = {};
		localSelectSearch = {};
		showColumnPicker = false;
		columnSearchText = '';
		table.resetColumnFilters();
	}

	function handleTextInput(column: Column<T, unknown>, value: string) {
		localText[column.id] = value;
		clearTimeout(timers[column.id]);
		timers[column.id] = setTimeout(() => {
			column.setFilterValue(value || undefined);
		}, 300);
	}

	function handleNumericInput(
		column: Column<T, unknown>,
		which: 'min' | 'max',
		value: number | null
	) {
		if (value === null) {
			if (which === 'min') delete localNumMin[column.id];
			else delete localNumMax[column.id];
		} else {
			if (which === 'min') localNumMin[column.id] = value;
			else localNumMax[column.id] = value;
		}
		clearTimeout(timers[`${column.id}_${which}`]);
		timers[`${column.id}_${which}`] = setTimeout(() => {
			const min = localNumMin[column.id];
			const max = localNumMax[column.id];
			column.setFilterValue(min === undefined && max === undefined ? undefined : [min, max]);
		}, 300);
	}

	function getSelectValues(column: Column<T, unknown>): string[] {
		return (column.getFilterValue() as string[] | undefined) ?? [];
	}

	function handleSelectChange(column: Column<T, unknown>, value: string, checked: boolean) {
		const current = getSelectValues(column);
		const next = checked ? [...current, value] : current.filter((v) => v !== value);
		column.setFilterValue(next.length ? next : undefined);
	}

	function getFacetedValues(column: Column<T, unknown>): string[] {
		return Array.from(column.getFacetedUniqueValues().keys()).map(String).sort();
	}

	function getFacetedMinMax(column: Column<T, unknown>): [number | undefined, number | undefined] {
		const vals = column.getFacetedMinMaxValues();
		return vals ? [vals[0] as number, vals[1] as number] : [undefined, undefined];
	}

	function getColumnFormatOptions(
		column: Column<T, unknown>
	): Intl.NumberFormatOptions | undefined {
		return (column.columnDef.meta as Record<string, unknown> | undefined)?.formatOptions as
			| Intl.NumberFormatOptions
			| undefined;
	}
</script>

<Popover.Root positioning={{ placement: 'bottom-end' }}>
	<Popover.Trigger
		class="flex h-9 cursor-pointer items-center rounded-md border border-surface-3 bg-surface-1 px-3 text-sm font-medium text-ink shadow-sm outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
	>
		{triggerLabel}
		{#if activeCount > 0}
			({activeCount})
		{/if}
	</Popover.Trigger>

	<Popover.Content class="w-72 p-0" showArrow={false}>
		<div class="flex items-center justify-between px-3 py-2.5">
			<span class="text-sm font-medium text-ink">Filters</span>
			{#if activeCount > 0}
				<button type="button" onclick={clearFilters} class="text-xs text-primary hover:underline">
					Clear all
				</button>
			{/if}
		</div>

		{#if activeColumns.length > 0}
			<div class="overflow-hidden border-t border-surface-3">
				<ScrollArea.Root class="h-96">
					<ScrollArea.Viewport>
						<ScrollArea.Content>
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
													value={localNumMin[column.id] ?? facetMin ?? null}
													min={facetMin}
													max={facetMax}
													formatOptions={colFormatOptions}
													onValueChange={({ valueAsNumber }) =>
														handleNumericInput(
															column,
															'min',
															isNaN(valueAsNumber) ? null : valueAsNumber
														)}
												/>
											</div>
											<div class="min-w-0 flex-1">
												<NumberInput
													layout="horizontal"
													label="To"
													value={localNumMax[column.id] ?? facetMax ?? null}
													min={facetMin}
													max={facetMax}
													formatOptions={colFormatOptions}
													onValueChange={({ valueAsNumber }) =>
														handleNumericInput(
															column,
															'max',
															isNaN(valueAsNumber) ? null : valueAsNumber
														)}
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
										{const allOptions = getFacetedValues(column)}
										{const search = localSelectSearch[column.id] ?? ''}
										{const options = search
											? allOptions.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
											: allOptions}
										{const selected = getSelectValues(column)}
										<div class="flex flex-col gap-1">
											<Field.Root>
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
											<ScrollArea.Root class="max-h-44">
												<ScrollArea.Viewport>
													<ScrollArea.Content>
														<div class="flex flex-col gap-0.5">
															{#each options as option (option)}
																<Checkbox
																	size="sm"
																	label={option}
																	class="min-h-7 rounded-sm px-2 hover:bg-surface-2"
																	checked={selected.includes(option)}
																	onCheckedChange={({ checked }) =>
																		handleSelectChange(column, option, checked === true)}
																/>
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
										<Field.Root>
											<Field.Input
												placeholder="Search..."
												value={localText[column.id] ?? ''}
												oninput={(e: Event) =>
													handleTextInput(column, (e.currentTarget as HTMLInputElement).value)}
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
