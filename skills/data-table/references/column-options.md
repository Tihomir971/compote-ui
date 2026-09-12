# Column Options

Column helper:

```ts
const col = DataTable.createDataTableColumnHelper<Row>();
```

Accessors:

```ts
col.accessor('fieldName', { header: 'Field' });
col.accessorFn((row) => row.a + row.b, { id: 'sum', header: 'Sum' });
col.group('Group', [col.accessor('name', { header: 'Name' })]);
col.columns([col.accessor('id', { header: 'ID' })]);
```

Common options:

- `header: string`
- `type?: 'text' | 'number' | 'currency' | 'percent' | 'boolean' | 'select' | 'url' | 'phone' | 'date' | 'time' | 'date-time' | 'action'`
- `align?: 'left' | 'center' | 'right'`
- `size?: number`
- `minSize?: number`
- `maxSize?: number`
- `enableResizing?: boolean`
- `enableHiding?: boolean`
- `enableSorting?: boolean`
- `enableColumnFilter?: boolean`
- `filterFn?: FilterFn | string`
- `formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions`
- `formatLocale?: string`
- `cell?: (value, row) => string | number | boolean | null | undefined`
- `cellComponent?: Component`
- `cellProps?: (value, row) => Record<string, unknown>`
- `cellSnippet?: Snippet`
- `pinned?: 'left' | 'right'` — sticky during horizontal scroll. Inside a `col.group(...)`, pinning
  a member column also pins the group header fragment above it, so the label stays visible while
  the rest of that group scrolls.
- `grow?: boolean`
- `sum?: boolean`
- `footer?: (values: unknown[]) => string | number | undefined`

Type defaults:

- `number`, `currency`: right aligned, size `120`
- `percent`: right aligned, size `100`
- `date`: center aligned, size `110`
- `time`: center aligned, size `80`
- `date-time`: center aligned, size `160`
- `boolean`: center aligned, size `90`
- `url`: center aligned, sorting disabled, size `60`
- `phone`: left aligned, size `160`
- `action`: center aligned, size `60`, sorting/hiding/column-filter all disabled — layout-only,
  carries no value to format or filter. Supply a `cellComponent`/`cellSnippet` for the row action
  buttons; the defaults keep the actions column out of the column-visibility menu and filter
  toolbar automatically.

Use one `grow: true` column to absorb extra horizontal space.

## Locale for number/currency/percent

Priority: `formatLocale` prop → `useLocaleContext().locale` → browser default. Wrap the app in
`<LocaleProvider locale="sr-RS">` to set the context locale for every formatted column.

## Custom cellComponent

```svelte
<!-- PriceCell.svelte -->
<script lang="ts">
	let { value, prices }: { value: number; prices: { vendor: string; price: number }[] } = $props();
</script>

<span>{value}</span>
```

```ts
col.accessorFn((row) => Math.min(...row.prices.map((p) => p.price)), {
	id: 'minPrice',
	header: 'Best Price',
	type: 'currency',
	align: 'right',
	cellComponent: PriceCell,
	cellProps: (value, row) => ({ value, prices: row.prices })
});
```

## Row height and cell alignment

Body cells are fixed at `h-9` (36px), matching the header, with content vertically centered — any
control up to 36px tall (every `Button` `icon-xs`/`icon-sm`/`icon`/`icon-lg` size) fits without
changing row height. Do **not** add negative margins (e.g. `-my-1`) to cell components to
compensate for row growth — in the virtualized table that fights the virtualizer's 37px row
estimate. Cells are `truncate` (single-line, `overflow: hidden`), so give action columns a little
extra `size` if a focus ring on a control near the edge gets clipped.

## DataTable.Search

Global filter input searching across all text columns, debounced (default 300ms).

- `table: DataTableInstance<T>` — required
- `placeholder?: string` (default `'Search...'`)
- `class?: ClassValue`
- `debounceMs?: number` (default `300`)

Text/number columns stay searchable even when the first row's value is `null`/`undefined`;
booleans and object-valued columns are excluded from global search. Also available as
`VirtualDataTable.Search` for the virtualized variant.

## DataTable.Root props

`table: DataTableInstance<T>` (required), `caption?: string` (sr-only `<caption>`),
`emptyMessage?: string` (default `'No rows found'`), `class?: ClassValue`,
`onRowClick?: (details: { row: T; event: MouseEvent }) => void`,
`onRowDoubleClick?: (details: { row: T; event: MouseEvent }) => void` — `row` is `row.original`.
Clicks on the row-selection checkbox and url-cell buttons do **not** trigger either handler.
`VirtualDataTable.Root` shares the same props.

```svelte
<DataTable.Root
	{table}
	onRowDoubleClick={({ row, event }) => {
		if (event.ctrlKey || event.metaKey) openInNewTab(row.id);
		else navigateTo(row.id);
	}}
/>
```
