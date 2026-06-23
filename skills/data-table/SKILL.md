---
name: data-table
description: >
  Load when using compote-ui/data-table or compote-ui/data-table/virtual.
  Covers TanStack Table v9 wrapper usage, createTable,
  createDataTableColumnHelper, table columns, row selection, filters,
  formatting, toolbars, virtualized imports, and optional peer dependencies.
metadata:
  type: composition
  library: compote-ui
  library_version: '0.62.1'
requires:
  - component-usage
  - theming
sources:
  - package.json
  - src/lib/components/data-table-v9/index.ts
  - src/lib/components/data-table-v9/types.ts
  - src/lib/components/data-table-v9/features.ts
  - src/lib/components/data-table-v9/column-helper.ts
  - src/lib/components/data-table-v9/create-table.svelte.ts
  - src/lib/components/data-table-v9/data-table.svelte
  - src/lib/components/data-table-v9/virtual/data-table-virtualized.svelte
  - src/lib/components/data-table-v9/virtual/data-table-virtual-rows.svelte
---

This skill builds on component-usage and theming. Read those first for Compote namespace imports and theme token behavior.

# Compote UI — Data Table

Use `compote-ui/data-table` for regular tables and `compote-ui/data-table/virtual` for virtualized rows.

## Integration Setup

```bash
bun add @tanstack/svelte-table
```

```svelte
<script lang="ts">
	import * as DataTable from 'compote-ui/data-table';

	type Invoice = {
		id: string;
		customer: string;
		total: number;
		paid: boolean;
	};

	let invoices = $state<Invoice[]>([
		{ id: 'inv_1', customer: 'Ada', total: 1200, paid: true },
		{ id: 'inv_2', customer: 'Grace', total: 800, paid: false }
	]);

	const col = DataTable.createDataTableColumnHelper<Invoice>();
	const columns = col.columns([
		col.accessor('id', { header: 'ID', enableHiding: false }),
		col.accessor('customer', { header: 'Customer', grow: true }),
		col.accessor('total', { header: 'Total', type: 'currency', align: 'right' }),
		col.accessor('paid', { header: 'Paid', type: 'boolean', align: 'center' })
	]);

	const table = DataTable.createTable({
		get data() {
			return invoices;
		},
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});
</script>

<DataTable.Toolbar>
	<DataTable.Title>Invoices</DataTable.Title>
	{#snippet center()}
		<DataTable.Search {table} class="w-56" />
	{/snippet}
	{#snippet right()}
		<DataTable.ColumnFilter {table} />
		<DataTable.ColumnVisibility {table} />
	{/snippet}
</DataTable.Toolbar>

<div class="h-96 min-h-0">
	<DataTable.Root {table} caption="Invoices" />
</div>
```

## Core Integration Patterns

### Use accessorFn with an explicit id

```ts
const columns = col.columns([
	col.accessorFn((row) => row.quantity * row.price, {
		id: 'total',
		header: 'Total',
		type: 'currency',
		align: 'right'
	})
]);
```

### Make runtime column changes reactive

```ts
const idCol = col.accessor('id', { header: 'ID', enableHiding: false });
const totalCol = col.accessor('total', { header: 'Total', type: 'currency' });

let columns = $state.raw([idCol]);

const table = DataTable.createTable({
	get data() {
		return invoices;
	},
	get columns() {
		return columns;
	},
	getRowId: (row) => row.id
});

function toggleTotal() {
	columns = columns.includes(totalCol)
		? columns.filter((column) => column !== totalCol)
		: [...columns, totalCol];
}
```

### Use virtual import for large row sets

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

<div class="h-96 min-h-0">
	<VirtualDataTable.Root {table} caption="Large dataset" />
</div>
```

## Common Mistakes

### CRITICAL Missing id for accessorFn column

Wrong:

```ts
col.accessorFn((row) => row.a + row.b, { header: 'Total' });
```

Correct:

```ts
col.accessorFn((row) => row.a + row.b, { id: 'total', header: 'Total' });
```

Accessor function columns cannot derive a stable column id from a key.

Source: `src/lib/components/data-table-v9/create-table.svelte.ts`

### HIGH Non-reactive reassigned columns

Wrong:

```ts
let columns = $state([idCol, nameCol]);
const table = DataTable.createTable({ data: rows, columns });
```

Correct:

```ts
let columns = $state.raw([idCol, nameCol]);
const table = DataTable.createTable({
	get data() {
		return rows;
	},
	get columns() {
		return columns;
	}
});
```

Reassigned columns must be passed through a getter and kept raw so identity checks keep working.

Source: `src/routes/components/data-table-v9/+page.svelte`, `src/lib/components/data-table-v9/create-table.svelte.ts`

### HIGH Rendering table without height constraint

Wrong:

```svelte
<DataTable.Root {table} />
```

Correct:

```svelte
<div class="h-96 min-h-0">
	<DataTable.Root {table} caption="Invoices" />
</div>
```

`DataTable.Root` fills its container and uses internal scrolling.

Source: `src/lib/components/data-table-v9/data-table.svelte`

### HIGH Importing virtual table without optional peer

Wrong:

```ts
import * as VirtualDataTable from 'compote-ui/data-table/virtual';
```

Correct:

```bash
bun add @tanstack/svelte-virtual
```

```ts
import * as VirtualDataTable from 'compote-ui/data-table/virtual';
```

The virtual subpath imports `@tanstack/svelte-virtual`.

Source: `package.json`, `src/lib/components/data-table-v9/virtual/data-table-virtual-rows.svelte`

## References

- [Column options](references/column-options.md)
- [Table state and reactivity](references/table-state-and-reactivity.md)
- [Virtual table](references/virtual-table.md)
