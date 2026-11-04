# DataTable.Export (CSV + xlsx)

Cilj: dugme u toolbaru koje preuzima vidljive kolone i filtrirane/sortirane redove kao CSV
ili xlsx. Format je priključiv (exporter), pa aplikacija može da doda svoj (npr. SheetJS ili
export na serveru) bez nove zavisnosti u biblioteci.

```svelte
<DataTable.Toolbar>
	<DataTable.Search {table} />
	{#snippet right()}
		<DataTable.Export {table} filename="korisnici" exporters={[csvExporter, xlsxExporter]} />
		<DataTable.ColumnVisibility {table} />
	{/snippet}
</DataTable.Toolbar>
```

## Polazno stanje

- `features.ts` nema `rowPaginationFeature` — tabela nema paginaciju. `table.getRowModel()` je
  već filtriran i sortiran (`table-view-state.svelte.ts`) i to je skup za export. (v9 core ima
  `getPrePaginatedRowModel()`, ali bez paginacije daje isto, pa nam ne treba.)
- `applyTypeFormat` za number tipove radi `Number(value)` — string `"1234.56"` se prikazuje kao
  broj. Podrazumevane opcije (`TYPE_NUMBER_FORMAT_DEFAULTS`): `number: {}` (do 3 decimale),
  `percent` (0 decimala), `currency: 'USD'` (decimale po valuti).
- `createColumns` pravi `columnDef.cell` za svaku kolonu, pa iz instance ne vidi da li je
  korisnik zadao `column.cell`.
- `createColumns` u `meta` stavlja samo `align/type/formatOptions/formatLocale/grow/sum/footer`.
  `cell` renderer je zatvoren u closure koji vraća `renderComponent`/`renderSnippet` ili `'-'`
  (`formatCellValue`), pa iz instance tabele nema puta do teksta ćelije.
- Locale dolazi iz `useLocaleContext()`, čita se samo u `createTable`.
- Boolean se prikazuje kao `'Yes'/'No'` (`applyTypeFormat`).
- Tabela crta kolone redom start → center → end (pinning), ne redom `getVisibleLeafColumns()`.
- Selekcija nije kolona (renderuje se zasebno, `isRowSelectionEnabled`).
- Postoji subpath `./data-table/virtual` — presedan za `./data-table/xlsx`.
- Ikone: `PhFileText`, `PhMicrosoftExcelLogo` već postoje; ikonu za trigger (download) dodati.

## Ključne odluke

1. **Exporter ugovor, ne `formats` + `onExport`.** Komponenta dobija `exporters`, svaki je
   `{ id, label, icon?, export(ctx) }`. Server-side export je samo još jedan exporter koji čita
   `ctx.table` (sorting, filteri, globalFilter, vidljive kolone) — poseban `onExport` nije
   potreban.
2. **xlsx preko `write-excel-file`, u subpathu `compote-ui/data-table/xlsx`.** Opcioni peer
   dependency. Paket se uvozi sa `await import('write-excel-file/browser')` unutar `export()`,
   pa je subpath bezbedan za SSR i plaća se (~19 KB gzip) tek na klik. Ko ne uvozi subpath, ne
   treba mu paket. SheetJS odbačen: 44 KB gzip samo za xlsx writer, ispravljene verzije samo sa
   `cdn.sheetjs.com`, stilovi samo u Pro.
3. **Jedan izvor teksta ćelije.** Iz `formatCellValue` izdvojiti `formatCellText(column, value,
row, locale)` (→ `column.cell` ili `applyTypeFormat`, vraća `string | undefined`). Ćelija ga
   koristi pa dodaje `'-'`; export ga koristi i ostavlja prazno. CSV i tabela uvek isto
   prikazuju (boolean ostaje `Yes/No` dok se lokalizacija ne reši za oba).
4. **Redovi:** `getRowModel().rows`; „izabrani“ = isti niz filtriran sa `row.getIsSelected()`,
   da ostanu filtrirani i sortirani. Nema automatskog prebacivanja na izabrane.
5. **Kolone:** `getStartVisibleLeafColumns()` + `getCenterVisibleLeafColumns()` +
   `getEndVisibleLeafColumns()`, bez kolona sa `enableExport === false`. Zaglavlje u grupi:
   `Grupa / Kolona`.

## Faza 1 — model, CSV, komponenta

### Tipovi kolone (`types.ts`)

- `exportValue?: (value: unknown, row: T) => unknown` — sirova vrednost za export (xlsx tip,
  i CSV tekst kad nema `cell`). Za kolone sa `cellComponent`/`cellSnippet` koje nose objekat.
  **Nikad se ne prosleđuje `column.cell`** — renderer i dalje dobija vrednost accessora.
- `enableExport?: boolean` — podrazumevano `type !== 'action'`.
- U `DataTableColumnMeta` dodati (pravi ih `createColumns`, closure nad kolonom i `localeCtx`):
  - `enableExport`, `exportValue`;
  - `hasCustomCell: boolean` — `typeof column.cell === 'function'`;
  - `formatText: (value, row) => string | undefined` — `column.cell(value, row)` ako postoji,
    inače `applyTypeFormat(value)`;
  - `formatTypedText: (value) => string | undefined` — uvek `applyTypeFormat(value)`, bez
    `cell` (za `exportValue`);
  - `resolveLocale: () => string` — `formatLocale ?? localeCtx().locale` (za xlsx formate).
- Group kolone ne dobijaju ništa novo.

### Matrica (`data-table-v9/export/export-data.ts`)

```ts
type ExportColumn = {
	id: string;
	header: string; // 'Grupa / Kolona' za grupisane
	type?: DataTableColumnType;
	formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
	hasCustomText: boolean; // meta.hasCustomCell && !meta.exportValue → xlsx piše tekst
	locale: string; // meta.resolveLocale()
	size: number; // px, za širinu kolone u xlsx
};
type ExportCell = { value: unknown; text: string }; // value = exportValue ?? getValue()
type ExportData = { columns: ExportColumn[]; rows: ExportCell[][] };
type ExportScope = 'filtered' | 'selected';

function getExportData<T>(table: DataTableInstance<T>, scope: ExportScope): ExportData;
```

Za `text` (prazno → `''`, ne `'-'`):

1. kolona ima `cell` → `formatText(getValue(), row)` — isto što tabela prikazuje;
2. inače, ima `exportValue` → `formatTypedText(exportValue(getValue(), row))`;
3. inače → `formatText(getValue(), row)` (= `applyTypeFormat`).

`value` je uvek `exportValue?.(getValue(), row) ?? getValue()`.

### Exporter (`data-table-v9/export/types.ts`)

```ts
type DataTableExportContext<T> = {
	table: DataTableInstance<T>;
	scope: ExportScope;
	filename: string; // bez ekstenzije
	getData: () => ExportData; // lenjo — server exporter je ne mora pozvati
};
type DataTableExporter = {
	id: string;
	label: string;
	icon?: Component;
	export: <T>(ctx: DataTableExportContext<T>) => void | Promise<unknown>;
};
```

### CSV (`src/lib/utils/csv.ts` + `data-table-v9/export/csv-exporter.ts`)

- `toCsv(rows: string[][], { separator = ';', bom = true })` — čista funkcija:
  - BOM `﻿` na početku; bez `sep=;` linije (Excel tada ignoriše BOM).
  - Redovi spojeni sa `\r\n`.
  - Pod navodnike vrednost koja sadrži `"`, separator, `\n` ili `\r`; `"` → `""`.
- Zaštita od CSV injection-a u exporteru: tekst koji počinje sa `= + - @ \t \r` dobija prefiks
  `'`. Jedini izuzetak: kolona tipa `number/currency/percent` **bez** `hasCustomText` — tada
  tekst sigurno dolazi iz `Intl.NumberFormat`, pa negativni brojevi ostaju netaknuti. Tip
  `value` se ne gleda (custom `cell` može nad brojem vratiti bilo kakav tekst). Zaglavlja
  prolaze istu zaštitu.
- `createCsvExporter({ separator?, label? })` i gotov `csvExporter` (`;`).
- Tekst = ono što se vidi u tabeli (npr. `1.234,56 RSD`) — svesno; za računanje je xlsx.

### Preuzimanje (`src/lib/utils/download.ts`)

`downloadBlob(blob, filename)`: `URL.createObjectURL` → privremeni `<a download>` → `click()` →
`revokeObjectURL` (u `setTimeout`, da Safari stigne da pokrene preuzimanje).

### Komponenta (`toolbar/data-table-export.svelte`)

Props: `table`, `exporters = [csvExporter]`, `filename = 'export'`, `triggerLabel?`.

- Selekcija prazna i jedan exporter → obično dugme (kao `Refresh`).
- Inače `Menu`: ako ima izabranih redova, `RadioItemGroup` „Svi redovi (n)“ / „Izabrani (k)“
  (podrazumevano „Svi“), pa `Separator`, pa po jedna stavka za svaki exporter.
- Busy stanje kao u `Refresh`: ako `export()` vrati promise, trigger je `aria-busy` /
  `aria-disabled` do kraja; ponovljeni klik se ignoriše. Greška se ne guta (propagira).
- Tooltip „Export“, `aria-label` kad nema `triggerLabel`, varijanta `outline`, `size: icon`.
- Broj izabranih = broj redova koje bi `selected` stvarno izvezao:
  `getRowModel().rows.filter(r => r.getIsSelected()).length` (ne `rowSelection` niti
  `getSelectedRowModel()`, koji ne poštuju filter). Reaktivno: u `$derived` čitati atome
  `rowSelection`, `columnFilters`, `globalFilter`, `sorting` i `data` (kao `columnVisibility`
  u `ColumnVisibility`). Ista funkcija (`getExportRows(table, scope)`) služi i za brojanje i za
  izvoz.
- Kad broj izabranih padne na 0, scope se vraća na `filtered` (i komponenta može preći na
  obično dugme); `selected` se nikad ne izvozi prazan.
- Izvoz u `index.ts` (`Export`, `csvExporter`, `createCsvExporter`, tipovi) i u
  `virtual/index.ts`.

## Faza 2 — xlsx subpath

- `data-table-v9/xlsx/index.ts` → `xlsxExporter`, `createXlsxExporter(options?)`.
- `package.json`:
  - `exports["./data-table/xlsx"]` po uzoru na `./data-table/virtual`;
  - `peerDependencies["write-excel-file"]: "^4.1.0"` + `peerDependenciesMeta.optional`;
  - `devDependencies` za playground i testove.
- Mapiranje ćelija (čista funkcija `toXlsxCell(column, cell, options)`, test bez paketa):
  - `number/currency/percent` → `Number`:
    - normalizacija kao u tabeli: `null/undefined/''` → prazna ćelija; inače `Number(value)`
      (string `"1234.56"` je broj); `NaN`/`±Infinity` → `String` iz `text`.
    - `format` iz efektivnih Intl opcija: `new Intl.NumberFormat(locale, { ...defaults,
...formatOptions }).resolvedOptions()` → `minimumFractionDigits` /
      `maximumFractionDigits`; decimalni deo = `0` × min + `#` × (max − min), grupisanje
      `#,##0` ako je `useGrouping` uključen. percent dodaje `%`; currency dodaje
      `"<kod>"` (simbol valute se ne pogađa).
    - podržani podskup: `style` decimal/percent/currency, fraction digits, `useGrouping`.
      Ako `resolvedOptions()` ima `notation !== 'standard'`, značajne cifre
      (`minimumSignificantDigits`/`maximumSignificantDigits`), `currencyDisplay: 'name'` ili
      `signDisplay` različit od `auto` → `String` iz `text` (fallback, ne pogrešan format).
  - `date/time/date-time` → `Date`. Excel nema zonu: vrednost pročitati sa `readDateInZone(
value, dateCellTimeZone(formatOptions))`, pa:
    - `CalendarDate` → `toCalendar(date, new GregorianCalendar()).toDate('UTC')`;
    - `ZonedDateTime` → `toCalendar(zdt, new GregorianCalendar())`, pa iz njegovih polja
      (zidni sat te zone) složiti „plutajući“ UTC `Date` preko `new Date(0)` +
      `setUTCFullYear(y, m - 1, d)` + `setUTCHours(h, min, s, ms)` — ne `Date.UTC`, koji
      godine 0–99 čita kao 1900+;
    - `null` → prazna ćelija.
      Formati iz opcija (`dateFormat = 'dd.mm.yyyy'`, `timeFormat = 'hh:mm'`,
      `dateTimeFormat = 'dd.mm.yyyy hh:mm'`).
  - `boolean` → `Boolean`.
  - sve ostalo, i svaka kolona sa `hasCustomText` → `String` iz `text`. Ćelije su tipizovane,
    pa nema formula injection-a i nema `'` prefiksa.
- Zaglavlje: `fontWeight: 'bold'`, `stickyRowsCount: 1`; širina kolone ≈ `size / 7` znakova.
- `export()`: `const { default: writeXlsxFile } = await import('write-excel-file/browser')`,
  `toBlob()` → `downloadBlob(blob, filename + '.xlsx')`.

## Testovi

- `src/lib/utils/csv.test.ts`: BOM uključen/isključen, separator, escape (`"`, separator,
  `\n`, `\r`), `\r\n`.
- `data-table-v9/export/export-data.test.ts` (preko `test-fixtures/data-table-fixture.svelte`,
  kao `create-table-filter-edits.test.ts`):
  - skrivene i `action` kolone se preskaču, `enableExport: false` takođe;
  - redosled prati pinning (start → center → end);
  - zaglavlje grupe `Grupa / Kolona`;
  - filter + sort se poštuju; `selected` daje samo izabrane, u sortiranom redu;
  - `exportValue` menja `value`; `text` iz `formatTypedText` kad nema `cell`;
  - kolona sa `cell` i `exportValue`: `cell` dobija vrednost accessora (ne `exportValue`),
    `text` je ono što tabela prikazuje;
  - prazna vrednost → `''`, ne `'-'`;
  - tekst ćelije jednak onome što tabela renderuje (`formatCellText`);
  - `getExportRows(table, 'selected')` sa izabranim redom koji je filtriran napolje → ne
    ulazi ni u broj ni u izvoz.
- `csv-exporter` test: prefiks `'` za `=SUM(...)` tekst; bez prefiksa za negativan broj u
  number koloni bez `cell`; **sa** prefiksom kad number kolona ima `cell` koji vraća
  `=HYPERLINK(...)`; zaglavlje `=X` dobija prefiks.
- `xlsx/xlsx-cell.test.ts` (čista funkcija, bez paketa):
  - `"1234.56"` u number koloni → broj; `''`/`null` → prazno; `NaN`/`Infinity` → tekst;
  - formati: `number: {}` → `#,##0.###`, `percent` → `0%`, USD → `#,##0.00 "USD"`, JPY →
    `#,##0 "JPY"`, `{ minimumFractionDigits: 2, maximumFractionDigits: 4 }` → `#,##0.00##`;
    `notation: 'compact'` → tekst;
  - datum oko ponoći u zadatoj zoni ostaje isti dan; godina 50 ostaje 50; `CalendarDate` u
    hebrejskom kalendaru → ispravan gregorijanski datum.
- `xlsx/xlsx-exporter.test.ts` (sa `write-excel-file` iz devDependencies, `node` entry ili
  `toBlob` u Node-u): generiše pravi fajl, raspakuje ga (`fflate`) i u `xl/worksheets/
sheet1.xml` proverava tip ćelija (`t="s"` / broj), `s` stil sa formatom i serijski broj
  datuma.
- Pakovanje: posle `bun run prepack`, test/skripta koja proverava da `dist/components/
data-table-v9/xlsx/index.js` postoji, da `publint` prolazi, da `compote-ui/data-table`
  **ne** uvozi `write-excel-file`, a da uvoz `compote-ui/data-table/xlsx` u Node-u (SSR) ne
  učitava paket dok se ne pozove `export()`.
- SSR render test komponente: jedno dugme vs. meni trigger (bez otvaranja menija).

## Ostalo

- Playground: Export u postojećoj stranici `src/routes/components/data-table-v9/+page.svelte`
  (CSV + xlsx, jedna kolona sa `exportValue`, jedna `action`).
- Skills: nova `skills/data-table/references/export.md` (exporter ugovor, CSV opcije, xlsx
  subpath i peer dependency, primer server exportera), link iz `SKILL.md`, dopuna
  `column-options.md` (`exportValue`, `enableExport`), bump `metadata.library_version` na
  verziju koja se objavljuje.
- `bun run check`, `bun run lint`, `bun run test` posle svake faze.

## Otvorena pitanja

- Podrazumevani formati datuma u xlsx (`dd.mm.yyyy` je evropski; alternativa `yyyy-mm-dd`).
- Da li lokalizovati labele (`Export`, `Svi redovi`, `Izabrani`) prop-ovima ili ostaviti
  engleske kao u `ColumnVisibility`/`Refresh`.
