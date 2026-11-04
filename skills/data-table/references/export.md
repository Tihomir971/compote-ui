# Export

`DataTable.Export` downloads the table as a file. It sits in the toolbar like `ColumnVisibility`
and takes the `table`.

```svelte
<script lang="ts">
	import * as DataTable from 'compote-ui/data-table';
</script>

<DataTable.Toolbar>
	{#snippet right()}
		<DataTable.Export {table} filename="invoices" />
		<DataTable.ColumnVisibility {table} />
	{/snippet}
</DataTable.Toolbar>
```

Props:

- `table: DataTableInstance<T>`
- `exporters?: DataTableExporter[]` — defaults to `[csvExporter]`.
- `filename?: string` — without extension, defaults to `'export'`.
- `triggerLabel?: string` — icon-only with a tooltip when omitted.

One exporter and no selected rows renders a plain button. More exporters, or any selected row,
renders a menu. When rows are selected the menu offers **All rows (n)** / **Selected rows (k)**.
`k` counts the selected rows the current filter keeps, exactly what gets exported.

## What gets exported

- **Columns:** the visible ones, in the order the table shows them (pinned left, center, pinned
  right). Columns with `enableExport: false` are skipped, and so are `type: 'action'` columns by
  default. A grouped column's header is `Group / Column`.
- **Rows:** the filtered and sorted rows (`table.getRowModel()`). The table has no pagination,
  so this is every matching row, not one page.
- **Cells:** the text the table shows (`cell`, else type formatting; `boolean`, `url` and
  `phone` as the table draws them, which ignores `cell`). Empty cells are blank, not `-`. A
  column with `exportValue` and no `cell` formats `exportValue` output by its `type`.

## CSV

`csvExporter` writes a UTF-8 BOM (so Excel reads č/ć/š/đ/ž correctly), `;` as the separator
(what Excel expects under most European locales), and CRLF line endings. Fields starting with
`= + - @`, tab or CR get a `'` prefix so spreadsheets don't run them as formulas. Exempt, so
negative numbers and phone numbers stay as they are: text made only of digits, spaces and number
punctuation (`-5`, `+381 60 123`), and number, currency and percent columns without their own
`cell`.

```ts
import { createCsvExporter } from 'compote-ui/data-table';

const commaCsv = createCsvExporter({ id: 'csv-comma', label: 'CSV (comma)', separator: ',' });
// Also: bom?: boolean (default true)
```

CSV holds the formatted text (`1,234.56 RSD`), so a spreadsheet can't sum it.

## Excel (.xlsx)

`xlsxExporter` lives in its own subpath and needs the optional peer `write-excel-file`
(about 19 KB gzip, loaded only when an export runs, so importing the subpath is SSR-safe):

```sh
bun add write-excel-file
```

```svelte
<script lang="ts">
	import * as DataTable from 'compote-ui/data-table';
	import { xlsxExporter } from 'compote-ui/data-table/xlsx';
</script>

<DataTable.Export {table} filename="invoices" exporters={[DataTable.csvExporter, xlsxExporter]} />
```

Cells stay computable in Excel:

- `number`, `currency`, `percent` → numbers, also from numeric strings (`"1234.56"`), with an
  Excel format built from the column's Intl options: grouping, the decimals Intl would show,
  `%`, and the currency code (`#,##0.00 "USD"`). Options Excel can't express (`notation`,
  significant digits, `signDisplay`, `currencyDisplay: 'name'`, …) fall back to the text.
- `date`, `time`, `date-time` → Excel dates, on the day and time the table shows in the column's
  zone (`formatOptions.timeZone`, else local). A `date` column drops the time; a `time` column
  keeps only the time of day, so it sorts by time. Formats default to `dd.mm.yyyy`, `hh:mm` and
  `dd.mm.yyyy hh:mm`.
- `boolean` → TRUE/FALSE for real `true`/`false`; other values are blank, as the table shows
  `-` for them.
- Everything else, and any column with its own `cell` but no `exportValue`, is the text the
  table shows. Typed cells can't hold formulas, so there is no `'` prefix.

The header row is bold and frozen; column widths follow the table's.

```ts
import { createXlsxExporter } from 'compote-ui/data-table/xlsx';

const excel = createXlsxExporter({
	sheet: 'Invoices',
	date: 'yyyy-mm-dd',
	dateTime: 'yyyy-mm-dd hh:mm'
	// also: time, id, label
});
```

`exportDataToXlsxBlob(data, options)` returns the file as a `Blob` (e.g. to upload instead of
download), and `toXlsxCell` maps one cell.

## Custom exporter

An exporter is `{ id, label, icon?, export(context) }`. `context` holds `table`, `scope`
(`'filtered' | 'selected'`), `filename` and `getData()`, which returns `{ columns, rows }`. Each
cell is `{ value, text }`. If `export` returns a promise, the trigger stays busy until it
settles. Errors are not caught.

Export on the server, from the table state:

```ts
import type { DataTableExporter } from 'compote-ui/data-table';

const serverExcel: DataTableExporter = {
	id: 'server-xlsx',
	label: 'Excel',
	export: async ({ table }) => {
		const url = await requestExport({
			sorting: table.atoms.sorting.get(),
			columnFilters: table.atoms.columnFilters.get(),
			globalFilter: table.atoms.globalFilter.get(),
			columns: table.getVisibleLeafColumns().map((column) => column.id)
		});
		window.location.assign(url);
	}
};
```

Use a library the app already has instead of `write-excel-file` (SheetJS here):

```ts
import { utils, writeFileXLSX } from 'xlsx';
import type { DataTableExporter } from 'compote-ui/data-table';

const sheetJs: DataTableExporter = {
	id: 'xlsx',
	label: 'Excel',
	export: ({ filename, getData }) => {
		const { columns, rows } = getData();
		const sheet = utils.aoa_to_sheet([
			columns.map((column) => column.header),
			...rows.map((cells) => cells.map((cell) => cell.text))
		]);
		const book = utils.book_new();
		utils.book_append_sheet(book, sheet, 'Sheet1');
		writeFileXLSX(book, `${filename}.xlsx`);
	}
};
```

`getExportData(table, scope)`, `getExportRows(table, scope)` and `getExportColumns(table)` are
exported for building export UI outside `DataTable.Export`.
