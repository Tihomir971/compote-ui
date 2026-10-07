<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import type { DataTableFeatures } from '../features';
	import { getColumnMeta } from '../data-table-utils';
	import { filterKindFor } from '../column-filter-kind';
	import type { ColumnFilterEditing } from '../column-filter-editing.svelte';
	import TextFilterEditor from './text-filter-editor.svelte';
	import RangeFilterEditor from './range-filter-editor.svelte';
	import BooleanFilterEditor from './boolean-filter-editor.svelte';
	import SelectFilterEditor from './select-filter-editor.svelte';
	import DateRangeFilterEditor from './date-range-filter-editor.svelte';

	type Props = {
		column: Column<DataTableFeatures, T, unknown>;
		editing: ColumnFilterEditing;
	};

	let { column, editing }: Props = $props();

	const kind = $derived(filterKindFor(getColumnMeta(column.columnDef)?.type));
</script>

{#if kind === 'range'}
	<RangeFilterEditor {column} {editing} />
{:else if kind === 'boolean'}
	<BooleanFilterEditor {column} />
{:else if kind === 'select'}
	<SelectFilterEditor {column} />
{:else if kind === 'date'}
	<DateRangeFilterEditor {column} />
{:else if kind === 'text'}
	<TextFilterEditor {column} {editing} />
{/if}
