<!--
	Test-only host for `createTable`, which needs a component context (locale context,
	onDestroy). Hands the created table to the test and, with `root`, renders it in a
	DataTable or VirtualDataTable; with `editorColumn`, renders that column's standalone
	ColumnFilterEditor. Lives outside `src/lib` so it never ships in the package.
-->
<script lang="ts" generics="T extends Record<string, unknown>">
	import { untrack } from 'svelte';
	import {
		createTable,
		type CreateDataTableOptions,
		type DataTableInstance
	} from '#lib/components/data-table-v9/create-table.svelte';
	import DataTable from '#lib/components/data-table-v9/data-table.svelte';
	import VirtualDataTable from '#lib/components/data-table-v9/virtual/data-table-virtualized.svelte';
	import ColumnFilterEditor from '#lib/components/data-table-v9/filter-editors/column-filter-editor.svelte';

	type Props = {
		options: CreateDataTableOptions<T>;
		onTable?: (table: DataTableInstance<T>) => void;
		root?: 'table' | 'virtual';
		headerFilters?: boolean;
		editorColumn?: string;
	};

	let { options, onTable, root, headerFilters, editorColumn }: Props = $props();

	const table = untrack(() => createTable(options));
	untrack(() => onTable?.(table));
</script>

{#if root === 'table'}
	<DataTable {table} {headerFilters} />
{:else if root === 'virtual'}
	<VirtualDataTable {table} {headerFilters} />
{/if}
{#if editorColumn}
	{@const column = table.getColumn(editorColumn)}
	{#if column}<ColumnFilterEditor {column} />{/if}
{/if}
