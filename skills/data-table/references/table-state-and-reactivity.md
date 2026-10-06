# Table State And Reactivity

Use reactive getters for state that changes:

```ts
const table = DataTable.createTable({
	get data() {
		return rows;
	},
	get columns() {
		return columns;
	},
	getRowId: (row) => row.id
});
```

Use `$state.raw` for column arrays that are reassigned:

```ts
let columns = $state.raw([idCol, nameCol]);
```

Read table state:

```ts
const selected = $derived(table.getSelectedRowModel().rows.map((row) => row.original));
const sorting = $derived(table.store.state.sorting);
const filters = $derived(table.store.state.columnFilters);
```

Change filters from app code with the table API — `column.setFilterValue(...)`,
`table.setColumnFilters(...)`, `table.resetColumnFilters()`. `DataTable.ColumnFilter` shows the
live filter value in its inputs (it only holds edits still inside the 300ms debounce), so an
external change clears or updates the inputs, and editing one range bound keeps the other
bound's current value. An edit still inside the debounce is dropped when its column's filter
changes from outside — even if the filter ends on its old value again (e.g. reset, then saved
filters restored), since `createTable` keeps a per-column filter revision that only goes up. A
reset that finds the filter already empty changes nothing (TanStack keeps the state reference),
so an edit typed into that empty filter still commits.

```ts
// e.g. drop every filter on columns that belong to the previous category
table.setColumnFilters((filters) => filters.filter((f) => !f.id.startsWith('attr_')));
```

Persist column visibility with the observer callback:

```ts
const table = DataTable.createTable({
	get data() {
		return rows;
	},
	columns,
	onColumnVisibilityChange: (visibility) => {
		localStorage.setItem('column-visibility', JSON.stringify(visibility));
	}
});
```

Initial `columnVisibility`, `columnSizing`, and `columnPinning` are computed when the table is created. Columns added later default to visible and use their own size.
