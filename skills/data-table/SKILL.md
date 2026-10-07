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
  library_version: '0.81.0'
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
  - src/lib/components/data-table-v9/data-table-head.svelte
  - src/lib/components/data-table-v9/header/column-header-filter.svelte
  - src/lib/components/data-table-v9/column-filter-kind.ts
  - src/lib/components/data-table-v9/filter-editors/column-filter-editor.svelte
  - src/lib/components/data-table-v9/column-filter-editing.svelte.ts
  - src/lib/utils/select-filter.ts
  - src/lib/utils/date-filter.ts
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

### Label toolbar triggers

`ColumnFilter` and `ColumnVisibility` render icon-only outline buttons by default (funnel and
columns icons, with `aria-label` and a hover tooltip). Pass `triggerLabel` to show text instead. `ColumnFilter`
shows the active filter count as a badge in the corner either way.

```svelte
<DataTable.ColumnFilter {table} triggerLabel="Filters" />
<DataTable.ColumnVisibility {table} triggerLabel="Columns" />
```

### Filter from column headers

Pass `headerFilters` to `DataTable.Root` / `VirtualDataTable.Root` to put a funnel in the header
of every filterable leaf column (not group headers, not `enableColumnFilter: false`, never
`type: 'action'`). The funnel shows on header hover/focus (always on touch screens); once the
column is filtered it stays visible, filled and in the primary color. Clicking it opens a popup
titled with the column name, with a "Clear" button and the editor for the column's type:

| Column `type`                       | Popup editor                           | Filter value                     |
| ----------------------------------- | -------------------------------------- | -------------------------------- |
| `number`, `currency`, `percent`     | From / To number inputs                | `[min?, max?]` (`inNumberRange`) |
| `boolean`                           | All / Yes / No                         | `true` / `false`                 |
| `select`                            | Search + checkbox list with row counts | array of options                 |
| `date`, `date-time`                 | From / To date pickers                 | `[from?, to?]` as `YYYY-MM-DD`   |
| anything else (`text`, `time`, ...) | Text search                            | string                           |

Edits apply immediately (text and number inputs after a 300ms debounce — also when the popup
closes first). The header popups and `DataTable.ColumnFilter` edit the same table state, so a
filter set in one shows in the other. `headerFilters` is opt-in and defaults to `false`.

```svelte
<div class="h-96 min-h-0">
	<DataTable.Root {table} caption="Invoices" headerFilters />
</div>
```

### Build your own filter UI

For filter controls outside the toolbar and header popups (a facet panel beside the table, a
filter sidebar), use the same building blocks the Funnel uses. They read and write the table's
column filters, so the Funnel, header funnels and your UI always show the same state.

- `ColumnFilterEditor` — the Funnel's editor for one column, picked by its type (see the table in
  "Filter from column headers"). Pass `editing` only if the editor can be torn down while it holds
  a pending text/range edit (see below); without it the editor uses one bound to the column's table.
- `ColumnFilterEditing` — the debounced text/range edits pending on a table, shared by every host.
  `isActive(columnId)` lets a host refuse writes from an editor it has already dropped (Ark's
  NumberInput commits on the blur its unmount triggers).
- `getColumnFilterKind(column)` / `filterKindFor(type)` — the column's `ColumnFilterKind`
  (`range`, `boolean`, `select`, `date` or `text`), or `null` for columns that never filter.
- `selectFilterOptions(column.getFacetedUniqueValues())` — a select column's options with row
  counts, sorted by label, "(empty)" last with value `EMPTY_SELECT_VALUE` (`null`). Counts are
  cross-filtered: every other active filter applies, the column's own does not.
- `getColumnLabel(column)` and the `DataTableColumnInstance<T>` type for the columns you list.

```svelte
<script lang="ts">
	import * as DataTable from 'compote-ui/data-table';

	let { table }: { table: DataTable.DataTableInstance<Product> } = $props();

	const facets = $derived(
		table
			.getAllLeafColumns()
			.filter((column) => column.getCanFilter() && DataTable.getColumnFilterKind(column))
	);
</script>

{#each facets as column (column.id)}
	<h3>{DataTable.getColumnLabel(column)}</h3>
	<DataTable.ColumnFilterEditor {column} />
{/each}
```

A custom select list writes the same value the Funnel does — an array of options, `undefined`
when none is ticked:

```ts
const selected = (column.getFilterValue() as DataTable.SelectFilterValue[] | undefined) ?? [];
column.setFilterValue(next.length ? next : undefined);
```

### Add a refresh button

`DataTable.Refresh` is data-source agnostic: it calls `onRefresh` and, if that returns a promise,
spins its icon and sets `aria-busy` until the promise settles. Clicks while busy are ignored. Pass
`loading` to force the busy state when a refresh starts elsewhere (polling, another control).

```svelte
<script lang="ts">
	import { getInvoices } from './invoices.remote';

	const invoices = getInvoices();
</script>

<DataTable.Toolbar>
	{#snippet right()}
		<DataTable.Refresh onRefresh={() => invoices.refresh()} />
		<DataTable.ColumnFilter {table} />
		<DataTable.ColumnVisibility {table} />
	{/snippet}
</DataTable.Toolbar>
```

Props: `onRefresh: () => void | Promise<unknown>`, `loading?: boolean`, `triggerLabel?: string`
(icon-only with `aria-label="Refresh"` and a tooltip when omitted). Errors thrown by `onRefresh` are not caught.

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
