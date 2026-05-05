<script lang="ts" generics="TData extends RowData, TSelected = object">
	import * as Field from '../field';
	import * as Popover from '../popover';
	import * as ScrollArea from '../scroll-area';
	import * as Fieldset from '../fieldset';
	import Checkbox from '../checkbox/checkbox.svelte';
	import Button from '../button/button.svelte';
	import NumberInput from '../number-input/number-input.svelte';
	import Select from '../select/select.svelte';
	import type { Column, RowData } from '@tanstack/svelte-table';
	import {
		getDataTableFilterConfig,
		type DataTable,
		type DataTableFeatures,
		type DataTableFilterConfig,
		type DataTableFilterOption,
		type DataTableSelectedState
	} from './core';

	type Props = {
		table: DataTable<TData, TSelected>;
		triggerLabel?: string;
	};

	type FilterableColumn = Column<DataTableFeatures, TData, unknown>;

	let { table, triggerLabel = 'Filters' }: Props = $props();

	const columnFilters = $derived((table.state as unknown as DataTableSelectedState).columnFilters);
	const activeFilterCount = $derived(columnFilters.length);
	const filterableColumns = $derived(
		table
			.getAllLeafColumns()
			.filter((column) => column.getCanFilter() && getDataTableFilterConfig(column.columnDef))
	);

	function getColumnLabel(column: FilterableColumn) {
		return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
	}

	function getFilterConfig(column: FilterableColumn, filtersState: unknown) {
		void filtersState;
		return getDataTableFilterConfig(column.columnDef);
	}

	function getFilterValue(column: FilterableColumn, filtersState: unknown) {
		void filtersState;
		return column.getFilterValue();
	}

	function setTextFilter(column: FilterableColumn, value: string) {
		column.setFilterValue(value || undefined);
	}

	function setBooleanFilter(column: FilterableColumn, value: string) {
		if (value === 'true') {
			column.setFilterValue(true);
			return;
		}

		if (value === 'false') {
			column.setFilterValue(false);
			return;
		}

		column.setFilterValue(undefined);
	}

	function setNumberRangeFilter(column: FilterableColumn, index: 0 | 1, value: number | null) {
		const currentValue = column.getFilterValue();
		const current = Array.isArray(currentValue) ? currentValue : [];
		const next = [current[0], current[1]] as [number | undefined, number | undefined];
		next[index] = value ?? undefined;

		column.setFilterValue(next[0] === undefined && next[1] === undefined ? undefined : next);
	}

	function getNumberRangeValue(
		column: FilterableColumn,
		filtersState: unknown
	): [number | undefined, number | undefined] {
		const value = getFilterValue(column, filtersState);
		return Array.isArray(value) ? [value[0], value[1]] : [undefined, undefined];
	}

	function getFacetOptions(
		column: FilterableColumn,
		config: DataTableFilterConfig,
		filtersState: unknown
	): DataTableFilterOption[] {
		void filtersState;

		if (config.type !== 'facet') return [];
		if (config.options) return config.options;

		return Array.from(column.getFacetedUniqueValues().entries())
			.sort(([a], [b]) => String(a).localeCompare(String(b)))
			.slice(0, config.maxOptions ?? 20)
			.map(([value, count]) => ({
				value,
				label: `${String(value)} (${count})`
			}));
	}

	function getFacetFilterValue(column: FilterableColumn, filtersState: unknown) {
		const value = getFilterValue(column, filtersState);
		return Array.isArray(value) ? value : [];
	}

	function getFacetOptionChecked(
		column: FilterableColumn,
		option: DataTableFilterOption,
		filtersState: unknown
	) {
		return getFacetFilterValue(column, filtersState).some((value) =>
			Object.is(value, option.value)
		);
	}

	function toggleFacetFilterValue(
		column: FilterableColumn,
		option: DataTableFilterOption,
		checked: boolean
	) {
		const currentValue = column.getFilterValue();
		const current = Array.isArray(currentValue) ? currentValue : [];
		const next = checked
			? [...current, option.value]
			: current.filter((value) => !Object.is(value, option.value));

		column.setFilterValue(next.length > 0 ? next : undefined);
	}

	function getBooleanFilterValue(column: FilterableColumn, filtersState: unknown) {
		const value = getFilterValue(column, filtersState);
		if (value === true) return 'true';
		if (value === false) return 'false';
		return null;
	}

	function getBooleanLabel(config: DataTableFilterConfig, value: boolean) {
		if (config.type !== 'boolean') return value ? 'True' : 'False';
		return value ? (config.trueLabel ?? 'True') : (config.falseLabel ?? 'False');
	}

	function getBooleanFilterItems(config: DataTableFilterConfig) {
		return [
			{ value: 'true', label: getBooleanLabel(config, true) },
			{ value: 'false', label: getBooleanLabel(config, false) }
		];
	}
</script>

<Popover.Root positioning={{ placement: 'bottom-end' }}>
	<Popover.Trigger
		class="flex h-9 cursor-pointer items-center gap-2 rounded-md border border-surface-3 bg-surface-1 px-3 text-sm font-medium text-ink shadow-sm outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
	>
		<span>{triggerLabel}</span>
		{#if activeFilterCount > 0}
			<span class="rounded-full bg-surface-3 px-1.5 text-xs text-ink-dim">
				{activeFilterCount}
			</span>
		{/if}
	</Popover.Trigger>

	<Popover.Content class="w-80 p-0" showArrow={false}>
		<Popover.Title class="flex items-center justify-between gap-3 border-b px-4 py-2">
			<div class="text-sm font-medium text-ink">Filters</div>
			<Button
				variant="ghost"
				disabled={activeFilterCount === 0}
				onclick={() => table.resetColumnFilters(true)}
			>
				Clear
			</Button>
		</Popover.Title>

		{#if filterableColumns.length === 0}
			<div class="py-2 text-sm text-ink-dim">No filters available</div>
		{:else}
			<ScrollArea.Root class="h-96">
				<ScrollArea.Viewport>
					<ScrollArea.Content>
						<div class="flex flex-col gap-4">
							{#each filterableColumns as column (column.id)}
								{@const config = getFilterConfig(column, columnFilters)}
								{#if config}
									<div class="space-y-2">
										{#if config.type === 'text'}
											<Field.Root>
												<Field.Label>{getColumnLabel(column)}</Field.Label>
												<Field.Input
													type="search"
													placeholder={config.placeholder ?? `Search ${getColumnLabel(column)}`}
													value={String(getFilterValue(column, columnFilters) ?? '')}
													oninput={(event) =>
														setTextFilter(column, (event.currentTarget as HTMLInputElement).value)}
												/>
											</Field.Root>
										{:else if config.type === 'number-range'}
											{@const rangeValue = getNumberRangeValue(column, columnFilters)}
											<div class="text-sm font-medium text-ink">{getColumnLabel(column)}</div>
											<div class="grid grid-cols-2 gap-2">
												<NumberInput
													label="Min"
													min={config.min}
													max={config.max}
													step={config.step}
													formatOptions={config.formatOptions ?? { minimumFractionDigits: 0 }}
													value={rangeValue[0] ?? null}
													onValueChange={({ valueAsNumber }) =>
														setNumberRangeFilter(
															column,
															0,
															Number.isNaN(valueAsNumber) ? null : valueAsNumber
														)}
												/>
												<NumberInput
													label="Max"
													min={config.min}
													max={config.max}
													step={config.step}
													formatOptions={config.formatOptions ?? { minimumFractionDigits: 0 }}
													value={rangeValue[1] ?? null}
													onValueChange={({ valueAsNumber }) =>
														setNumberRangeFilter(
															column,
															1,
															Number.isNaN(valueAsNumber) ? null : valueAsNumber
														)}
												/>
											</div>
										{:else if config.type === 'boolean'}
											<Select
												label={getColumnLabel(column)}
												items={getBooleanFilterItems(config)}
												placeholder="All"
												value={getBooleanFilterValue(column, columnFilters)}
												onValueChange={({ value }) =>
													setBooleanFilter(
														column,
														Array.isArray(value) && value.length > 0 ? value[0] : ''
													)}
											/>
										{:else if config.type === 'facet'}
											<Fieldset.Root class="max-h-44">
												<Fieldset.Legend>{getColumnLabel(column)}</Fieldset.Legend>
												<ScrollArea.Root class="hrounded-md border border-surface-3">
													<ScrollArea.Viewport>
														<ScrollArea.Content class="p-1 pe-3">
															<div class="flex flex-col">
																{#each getFacetOptions(column, config, columnFilters) as option (String(option.value))}
																	<Checkbox
																		size="sm"
																		label={option.label}
																		class="min-h-8 rounded-sm px-2 hover:bg-surface-2"
																		checked={getFacetOptionChecked(column, option, columnFilters)}
																		onCheckedChange={({ checked }) =>
																			toggleFacetFilterValue(column, option, checked === true)}
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
											</Fieldset.Root>
										{/if}
									</div>
								{/if}
							{/each}
						</div>
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical">
					<ScrollArea.Thumb />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>
		{/if}
	</Popover.Content>
</Popover.Root>
