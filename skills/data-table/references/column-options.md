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
- `type?: 'text' | 'number' | 'currency' | 'percent' | 'boolean' | 'select' | 'url' | 'phone' | 'date' | 'time' | 'date-time'`
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
- `pinned?: 'left' | 'right'`
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

Use one `grow: true` column to absorb extra horizontal space.
