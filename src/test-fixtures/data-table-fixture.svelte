<!--
	Test-only host for `createTable`, which needs a component context (locale context,
	onDestroy). Hands the created table to the test and, with `root`, renders it in a
	DataTable or VirtualDataTable. Lives outside `src/lib` so it never ships in the package.
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

	type Props = {
		options: CreateDataTableOptions<T>;
		onTable?: (table: DataTableInstance<T>) => void;
		root?: 'table' | 'virtual';
		headerFilters?: boolean;
	};

	let { options, onTable, root, headerFilters }: Props = $props();

	const table = untrack(() => createTable(options));
	untrack(() => onTable?.(table));
</script>

{#if root === 'table'}
	<DataTable {table} {headerFilters} />
{:else if root === 'virtual'}
	<VirtualDataTable {table} {headerFilters} />
{/if}
