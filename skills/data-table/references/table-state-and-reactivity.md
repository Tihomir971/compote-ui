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
