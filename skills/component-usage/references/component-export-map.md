# Component Export Map

Root exports:

- `Avatar`
- `Badge`
- `Button`, `LinkButton`
- `Checkbox`, `CheckboxGroup`
- `Combobox`
- `DateField`, `DateRangeField`, `DateInput`, `DatePicker`
- `AlertDialog`
- `FileUploadDropzone`, `FileUpload`
- `FormatByte`, `FormatNumber`, `FormatRelativeTime`, `FormatTime`
- `ImageCropper`, `ImageCropDialog`, `ImageUpload`
- `JsonTreeView`
- `NumberInput`, `PasswordInput`, `PhoneInput`
- `ProgressLinear`, `ProgressCircular`
- `QrCode`
- `Select`
- `Splitter`
- `Switch`
- `TagsInput`
- `Toggle`
- `TreeView`
- `LocaleProvider`, `useLocaleContext`
- `Portal`
- `PersistedState`, `Debounced`
- `cn`

Namespace exports:

- `AppShell`
- `Card`
- `Collapsible`
- `HoverCard`
- `ScrollArea`
- `Carousel`
- `Dialog`
- `DataTable` (subpath: `compote-ui/data-table`, not re-exported from root)
- `VirtualDataTable` (subpath: `compote-ui/data-table/virtual`, not re-exported from root)
- `Drawer`
- `Field`
- `Fieldset`
- `Listbox`
- `Menu`
- `NavRail`
- `Popover`
- `Table`
- `Tabs`
- `Toast`
- `ToggleGroup`
- `Tooltip`

Utility exports:

- `loadImage`
- `fileToDataUrl`
- `cropImage`
- `processImage`
- `createListCollection`
- `createTreeCollection`
- `toDateValue`, `dateValueToString`, `dateValueToDate`

`DataTable` and `VirtualDataTable` are deliberately **not** root exports — they pull in the
`@tanstack/svelte-table` (and, for the virtual variant, `@tanstack/svelte-virtual`) peer
dependency, so importing them from the root package would force that peer on every consumer.
Import them from the subpath instead: `import * as DataTable from 'compote-ui/data-table'`. See
the `data-table` skill.
