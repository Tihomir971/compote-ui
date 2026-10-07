<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import * as Field from '../../field';
	import * as ScrollArea from '../../scroll-area';
	import Checkbox from '../../checkbox/checkbox.svelte';
	import type { DataTableFeatures } from '../features';
	import { selectFilterOptions, type SelectFilterValue } from '#lib/utils/select-filter';

	type Props = {
		column: Column<DataTableFeatures, T, unknown>;
	};

	let { column }: Props = $props();

	let search = $state('');

	const allOptions = $derived(selectFilterOptions(column.getFacetedUniqueValues()));
	const options = $derived(
		search
			? allOptions.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
			: allOptions
	);
	const selected = $derived((column.getFilterValue() as SelectFilterValue[] | undefined) ?? []);

	function toggle(value: SelectFilterValue, checked: boolean) {
		const next = checked ? [...selected, value] : selected.filter((v) => v !== value);
		column.setFilterValue(next.length ? next : undefined);
	}
</script>

<div class="flex flex-col gap-1">
	<Field.Root hideMessageLine>
		<Field.Input placeholder="Search..." bind:value={search} />
	</Field.Root>
	<ScrollArea.Root>
		<ScrollArea.Viewport class="max-h-40">
			<ScrollArea.Content>
				<div class="flex flex-col gap-0.5">
					{#each options as option (option.value)}
						<div class="flex min-h-7 items-center gap-2 rounded-sm pr-2 hover:bg-surface-2">
							<Checkbox
								size="sm"
								label={option.label}
								class="min-h-7 flex-1 px-2"
								checked={selected.includes(option.value)}
								onCheckedChange={({ checked }) => toggle(option.value, checked === true)}
							/>
							<span class="text-xs text-ink-dim tabular-nums">{option.count}</span>
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
