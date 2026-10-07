<script lang="ts" generics="T extends RowData">
	import type { Column, RowData } from '@tanstack/svelte-table';
	import type { DataTableFeatures } from '../features';
	import { getColumnFilterKind } from '../column-filter-kind';
	import { ColumnFilterEditing } from '../column-filter-editing.svelte';
	import TextFilterEditor from './text-filter-editor.svelte';
	import RangeFilterEditor from './range-filter-editor.svelte';
	import BooleanFilterEditor from './boolean-filter-editor.svelte';
	import SelectFilterEditor from './select-filter-editor.svelte';
	import DateRangeFilterEditor from './date-range-filter-editor.svelte';

	type Props = {
		column: Column<DataTableFeatures, T, unknown>;
		/**
		 * Pending (debounced) text and range edits. Hosts that can tear an editor down while
		 * it still holds an edit pass their own, with `isActive`; otherwise the editor uses
		 * one bound to the column's table.
		 */
		editing?: ColumnFilterEditing;
	};

	let { column, editing: editingProp }: Props = $props();

	const ownEditing = new ColumnFilterEditing({ table: () => column.table });
	const editing = $derived(editingProp ?? ownEditing);
	const kind = $derived(getColumnFilterKind(column));
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
