# Header column filters (funnel u headeru kolone)

Cilj: funnel ikona u headeru svake filtrabilne kolone otvara popup sa editorom
specifičnim za tip filtera. Isti editori se koriste i u toolbar `ColumnFilter`-u.

## Polazno stanje

- Svi editori (text / range / boolean / select) su inline u
  `src/lib/components/data-table-v9/toolbar/data-table-column-filter.svelte`, zajedno sa
  debounce logikom (`DebouncedFilterEdits`, `editBase`, `isCardActive`).
- `getFilterFnForType` (`create-table.svelte.ts`) pokriva samo number/currency/percent,
  boolean i select. `date` / `time` / `date-time` padaju na TanStack `auto` + text input.
- `Popover.Root` ima `lazyMount` + `unmountOnExit = true`, Content ide kroz Portal.

## Ključne odluke

1. **Editori kao zasebne komponente** (`data-table-v9/filter-editors/`), dele ih toolbar i
   header popup.
2. **Pending izmene pripadaju tabeli, ne hostu.** Debounced text/range izmene žive u
   registry-ju po tabeli (`column-filter-editing.svelte.ts`, kao `filter-revisions`), ključ je
   id kolone. `ColumnFilterEditing` je tanak sloj po hostu (toolbar, svaki header) koji nosi
   samo `isActive` zaštitu. Posledice:
   - najnovija izmena iste kolone pobeđuje bez obzira odakle dolazi (header ili toolbar);
     range granice iz različitih hostova se spajaju;
   - "Clear all" / "Clear" otkazuju pending izmene svih hostova;
   - izmena se commituje i posle zatvaranja popupa (nije potreban `flush`);
   - hostovi ne otkazuju ništa na destroy; `createTable` otkazuje sve na svom destroy;
   - `table.resetColumnFilters()` i `table.reset()` (obmotani u `createTable`) otkazuju sve
     pending izmene, i kad se nijedna primenjena vrednost ne menja — inače bi se izmena na
     koloni bez filtera primenila posle reseta i vratila filter.
3. **`filterKindFor(type)`** — čista funkcija, jedini izvor istine za mapiranje tip → editor
   i tip → filterFn.
4. Jedan popup sa telom po tipu (ne pet popover komponenti).
5. **Funnel** je brat sort dugmeta (ne dete), `aria-label="Filter {kolona}"`, `data-active`.
   Pozicioniran je `absolute` na unutrašnjoj ivici `th`, suprotno od poravnanja labele
   (`right-1`, odnosno `left-1` za desno poravnate kolone), sa `bg-surface-2`.
   - Neaktivan: vidljiv na hover/focus/open (uvek na touch), ne zauzima širinu labele.
   - Aktivan: uvek vidljiv, `text-primary`, popunjena ikona; `th` dobija `pr-6` / `pl-6` da
     funnel ne prekrije indikator sortiranja.
6. Opt-in prop `headerFilters?: boolean` (default `false`) na `DataTable` i `VirtualDataTable`.
7. **Primena odmah**, bez "Apply" dugmeta — i za date range (vidi fazu 3). Time Escape, klik
   van popupa i "Clear" nemaju nepotvrđeno stanje koje treba definisati.
8. **Pristupačan naziv popupa**: `Popover.Title` + eksplicitni `ids.title` na Root-u i
   `aria-labelledby` na Content-u. Zag proverava renderovan naslov samo pri startu mašine,
   pre nego što lazy content postoji, pa sam nikad ne postavi `aria-labelledby`.

## Faze

### Faza 1 — refaktor bez vidljive promene ✅

1. `data-table-v9/column-filter-kind.ts` + test; `getFilterFnForType` se oslanja na njega.
2. `data-table-v9/column-filter-editing.svelte.ts` kontroler + test.
3. Izdvojiti `text-`, `range-`, `boolean-`, `select-filter-editor.svelte` u `filter-editors/`,
   plus `column-filter-editor.svelte` (dispatch po kind-u).
4. Toolbar koristi kontroler i dispatch editor; markup editora ostaje isti.
5. `bun run test`, `bun run check`, `bun run lint`, provera u playground-u.

### Faza 2 — header funnel ✅

6. `data-table-v9/header/column-header-filter.svelte` (Popover `bottom-start`,
   `Popover.Title` sa nazivom kolone, "Clear", `ColumnFilterEditor`).
7. `data-table-head.svelte`: `th` markup ostaje isti; dodaje se `group/th` i apsolutno
   pozicioniran `ColumnHeaderFilter` kad je `headerFilters` i `column.getCanFilter()` na leaf
   headeru; padding na strani funnel-a dok je filter aktivan.
8. Prop `headerFilters` kroz `data-table.svelte` i `virtual/data-table-virtualized.svelte`;
   ikona `PhFunnelFill` za aktivno stanje; `view.columnFilters` u `table-view-state`.
9. Pending izmene po tabeli (odluka 2) + testovi koordinacije u
   `column-filter-editing.test.ts`: najnovija izmena iz drugog hosta pobeđuje (text i
   range), "Clear all" otkazuje izmene drugog hosta, commit posle zatvaranja popupa
   (pre isteka debounce-a), spoljašnji reset, otkazivanje kad tabela nestane.
10. Reset otkazuje pending izmene (odluka 2) + `filter-reset.test.ts` nad pravom tabelom iz
    `createTable` (fixture `src/test-fixtures/data-table-fixture.svelte`, van `src/lib` da ne
    ide u paket): prazna kolona sa pending izmenom posle `resetColumnFilters()` i `reset()`.
11. Vizuelna provera: uske (80–90px) desno poravnate i centrirane kolone sa istovremeno
    aktivnim sortiranjem i filterom — labela, strelica i funnel vidljivi.

### Faza 3 — date filter ✅

Ugovor:

- **Kind**: `'date'` za `date` i `date-time`. `time` ostaje `text` dok ne dobije zaseban
  ugovor (vidi "Kasnije").
- **Vrednost filtera**: `[from?: string, to?: string]`, kalendarski datumi `YYYY-MM-DD`
  (bez vremena i zone — serijalizabilno, pogodno za URL / persist).
- **Vremenska zona**: dan ćelije se računa u zoni u kojoj se ćelija prikazuje —
  `formatOptions.timeZone` ako je zadat, inače lokalna. Vrednost ćelije (Date / epoch broj /
  ISO / DB string / `DateValue`) čita novi `readDateInZone` iz `utils/date.ts` — za razliku od
  `toDateValue` eksplicitno prevodi i `ZonedDateTime` u zonu prikaza i nikad ne baca (nevalidno
  → `null`). **Isti helper koristi i prikaz ćelije** (`formatDateCell`), pa ćelija uvek
  prikazuje dan po kom se filtrira:
  - `YYYY-MM-DD` (i `CalendarDate`) je kalendarski datum i poredi se direktno — nikad se ne
    pretvara u `Date` pa u zonu, jer bi mogao da padne na prethodni dan;
  - `Date`, timestamp sa offsetom (`Z`, `+02:00`) i `ZonedDateTime` su trenuci i prevode se
    u zonu prikaza; lokalni datetime bez offseta se tumači u zoni prikaza.
- **Granice**: obe uključive po kalendarskom danu. Za `date-time` to znači poluotvoren
  interval `početak(from) <= vrednost < početak(to + 1 dan)` sa granicama dana iz kalendara u
  izabranoj zoni, ne +24h. Implementirano poređenjem kalendarskog dana trenutka u zoni
  prikaza (`toCalendarDate`), što je ekvivalentno i ne zahteva računanje početka dana;
  testovi pokrivaju 23h i 25h DST dan, uključujući slučaj koji bi "+24h" pogrešno prihvatio.
- **Prazne vrednosti**: prazna granica = otvoren kraj; obe prazne = filter se uklanja
  (`autoRemove`). Nevalidna granica (nije `YYYY-MM-DD`) se ignoriše. Prazna ili nevalidna
  vrednost ćelije ne prolazi dok je filter aktivan.
- **Obrnut raspon** (`from > to`): granice se zamenjuju, kao TanStack `inNumberRange`.
- **UI**: bez "Apply" (odluka 7); svaka izabrana granica se primenjuje odmah. Delimično
  otkucan, nevalidan datum se ne primenjuje i odbacuje se zatvaranjem.

Koraci:

12. `utils/date.ts` `readDateInZone` + testovi; `utils/date-filter.ts` (`resolveDateRange`
    koji uvek vraća objekat — TanStack za nullish `resolveFilterValue` uzima sirovu vrednost —
    `matchesDateRange`, `isEmptyDateRange`) + testovi za svaku tačku ugovora;
    `filterKindFor` → `'date'`; `getFilterFnForType(column)` pravi filterFn sa zonom kolone.
13. `data-table-v9/date-cell.ts`: `formatDateCell` zamenjuje `new Date(value)` u
    `applyTypeFormat` (popravlja prikaz `YYYY-MM-DD` zapadno od UTC) + test da prikazani dan
    prolazi filter na taj dan.
14. `date-range-filter-editor.svelte`: dva `DatePicker`-a "From" / "To" (ne `DateRangeField`
    — on ignoriše kraj bez početka, a ugovor dozvoljava raspon otvoren na jednu stranu).
15. Oba filter popovera su `unmountOnExit={false}`: uklanjanje fokusiranog `DatePicker`-a
    (Escape iz date polja) baca u Svelte runtime-u (zag `flushSync` tokom teardown-a).
    Opšta popravka je izdvojena u zaseban zadatak.
16. Test stvarne `onDestroy` registracije u `createTable` (SSR uništava komponentu na kraju
    renderovanja; test pada ako se registracija ukloni).

### Faza 4 — testovi, playground, docs ✅

17. SSR testovi (`header-filters.test.ts`, oba `Root`-a preko fixture-a): funnel samo za
    filtrabilne leaf kolone (ne `enableColumnFilter: false`, `action`, grupni header), nema ga
    bez `headerFilters`, `data-active` i padding uz `initialState.columnFilters`.
18. Playground: `headerFilters` na Column Types (svi tipovi) i obe person tabele, uz opis.
19. `skills/data-table/`: `SKILL.md` ("Filter from column headers", `library_version`
    0.80.0, sources), `column-options.md` (prikaz i filter datuma, `headerFilters` prop),
    `table-state-and-reactivity.md` (zajedničke pending izmene, reset ih otkazuje — stara
    rečenica da izmena u praznom filteru preživi reset je uklonjena).

### Spojena popravka Popover naziva (worktree `claude/suspicious-torvalds-53d2cf`) ✅

- Pri spajanju `popover-content.svelte` (menjan na obe strane) zadržati verziju iz tog
  worktree-ja; ona već prosleđuje rest props.
- Ukloniti lokalnu zaobilaznicu: u `header/column-header-filter.svelte` `titleId`,
  `ids={{ title: titleId }}` i `aria-labelledby={titleId}`; u
  `toolbar/data-table-column-filter.svelte` `titleId` sa komentarom iznad, `title: titleId`
  iz Root `ids` i `aria-labelledby={titleId}`. Proveriti u browseru da `aria-labelledby`
  i dalje pokazuje na naslov.

### Spojena DatePicker popravka (worktree `claude/hungry-wiles-5fba42`) ✅

- Uzrok: Svelte runtime bug (ugnježden `flushSync` iz zag blur-a dok presence uklanja
  content iz `$effect`-a, kad je dokument skriven). Popravka: `utils/release-focus-on-exit.ts`
  (`onexitcomplete` blur-uje fokusirano polje pre uklanjanja) na Popover / Dialog / AlertDialog
  / Drawer content-u.
- `popover-content.svelte` menjaju tri grane (ova: rest props; popravka naziva: labele;
  ova popravka: `{...releaseFocusOnExitProps}`) — spojiti sve tri izmene.
- Ukloniti `unmountOnExit={false}` i komentar iznad njega iz `header/column-header-filter.svelte`
  i `toolbar/data-table-column-filter.svelte`. Proveriti pravim Escape-om iz date polja
  (i sa skrivenim dokumentom) da nema grešaka i da se otkucan datum primenjuje.

Obe su prenete u main working tree kao necommitovane izmene (bez `src/routes/svelte-repro/`,
koji je bio samo reprodukcija buga), zaobilaznice su uklonjene. Provereno u browseru: oba
popovera imaju `aria-labelledby` na `h2` naslov; Escape iz date polja bez greške i otkucan
datum se primenjuje.

### Kasnije

- `time` filter: vrednost `[from?: 'HH:mm', to?: 'HH:mm']`, uključive minute; definisati
  raspon preko ponoći (`22:00–02:00`) pre implementacije.
- Operatori za text (contains / equals / starts with) i date (before / after / between).
- "Select all / Only this" u select listi; `ToggleGroup` za boolean.
- `filterComponent` po koloni; brzi sort u istom popupu.
