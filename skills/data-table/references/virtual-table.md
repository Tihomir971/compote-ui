# Virtual Table

Use `compote-ui/data-table/virtual` for large row counts.

```bash
bun add @tanstack/svelte-virtual
```

```svelte
<script lang="ts">
	import * as VirtualDataTable from 'compote-ui/data-table/virtual';

	const table = VirtualDataTable.createTable({
		get data() {
			return rows;
		},
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});
</script>

<VirtualDataTable.Toolbar>
	<VirtualDataTable.Title>Large Table</VirtualDataTable.Title>
	{#snippet center()}
		<VirtualDataTable.Search {table} class="w-56" />
	{/snippet}
	{#snippet right()}
		<VirtualDataTable.ColumnFilter {table} />
		<VirtualDataTable.ColumnVisibility {table} />
	{/snippet}
</VirtualDataTable.Toolbar>

<div class="h-96 min-h-0">
	<VirtualDataTable.Root {table} caption="Large dataset" />
</div>
```

Differences from regular table:

- Import path is `compote-ui/data-table/virtual`.
- Add the optional `@tanstack/svelte-virtual` peer.
- Rows are absolutely positioned with transforms.
- The table uses grid layout internally.
