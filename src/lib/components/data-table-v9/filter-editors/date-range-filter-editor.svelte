<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import DatePicker from '../../date-picker/date-picker.svelte';
	import type { DataTableFeatures } from '../features';
	import { getColumnMeta } from '../data-table-utils';
	import { dateCellTimeZone } from '../date-cell';
	import type { DateRangeFilterValue } from '#lib/utils/date-filter';

	type Props = {
		column: Column<DataTableFeatures, T, unknown>;
	};

	let { column }: Props = $props();

	const meta = $derived(getColumnMeta(column.columnDef));
	// Pick days in the zone the column is shown and filtered in, so "today" matches the cells.
	const timeZone = $derived(
		dateCellTimeZone(meta?.formatOptions as Intl.DateTimeFormatOptions | undefined)
	);

	function bound(index: 0 | 1): string | null {
		const value = column.getFilterValue();
		const bound = Array.isArray(value) ? value[index] : undefined;
		return typeof bound === 'string' ? bound : null;
	}

	// Each picked bound applies at once. The picker emits `YYYY-MM-DD` for a day it accepted
	// and null when cleared; a half-typed date never reaches here.
	function setBound(index: 0 | 1, next: unknown) {
		const value = column.getFilterValue();
		const range: DateRangeFilterValue = Array.isArray(value)
			? [value[0] as string | undefined, value[1] as string | undefined]
			: [undefined, undefined];
		range[index] = typeof next === 'string' && next ? next : undefined;
		column.setFilterValue(range[0] || range[1] ? range : undefined);
	}
</script>

<div class="flex flex-col gap-2">
	<DatePicker
		label="From"
		locale={meta?.formatLocale}
		{timeZone}
		bind:value={() => bound(0), (next) => setBound(0, next)}
	/>
	<DatePicker
		label="To"
		locale={meta?.formatLocale}
		{timeZone}
		bind:value={() => bound(1), (next) => setBound(1, next)}
	/>
</div>
