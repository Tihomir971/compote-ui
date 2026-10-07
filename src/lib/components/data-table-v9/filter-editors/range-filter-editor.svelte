<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import NumberInput from '../../number-input/number-input.svelte';
	import type { DataTableFeatures } from '../features';
	import { getColumnMeta } from '../data-table-utils';
	import type { ColumnFilterEditing } from '../column-filter-editing.svelte';

	type Props = {
		column: Column<DataTableFeatures, T, unknown>;
		editing: ColumnFilterEditing;
	};

	let { column, editing }: Props = $props();

	const facetBounds = $derived.by((): [number | undefined, number | undefined] => {
		const vals = column.getFacetedMinMaxValues();
		return vals ? [vals[0] as number, vals[1] as number] : [undefined, undefined];
	});
	const formatOptions = $derived(
		getColumnMeta(column.columnDef)?.formatOptions as Intl.NumberFormatOptions | undefined
	);
</script>

<div class="flex flex-col gap-1.5">
	<div class="min-w-0 flex-1">
		<NumberInput
			layout="horizontal"
			label="From"
			bind:value={
				() => editing.rangeBound(column, 'min'),
				(bound) => editing.editRange(column, 'min', bound ?? null)
			}
			min={facetBounds[0]}
			max={facetBounds[1]}
			{formatOptions}
		/>
	</div>
	<div class="min-w-0 flex-1">
		<NumberInput
			layout="horizontal"
			label="To"
			bind:value={
				() => editing.rangeBound(column, 'max'),
				(bound) => editing.editRange(column, 'max', bound ?? null)
			}
			min={facetBounds[0]}
			max={facetBounds[1]}
			{formatOptions}
		/>
	</div>
</div>
