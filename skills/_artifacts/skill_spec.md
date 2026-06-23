# Compote UI — Skill Spec

Compote UI is a Svelte 5 component library built on Ark UI, Tailwind CSS 4, and custom component wrappers. It ships styled UI primitives, utility functions, a theme stylesheet, and a separate data-table subpath for TanStack Table v9 integrations.

## Domains

| Domain                               | Description                                                                                                                            | Skills                                                                                            |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Starting Svelte apps with Compote UI | Installing the package, importing theme CSS, satisfying peer dependencies, and rendering first components in SvelteKit.                | getting-started                                                                                   |
| Using component groups               | Choosing and composing exported components and utilities by UI task: forms, overlays, layout, display, interaction, files, and images. | component-usage, forms-and-inputs, overlays-and-floating-ui, layout-and-display, files-and-images |
| Customizing theme and styling        | Importing theme CSS, overriding Compote CSS variables, and using Tailwind utilities generated from theme tokens.                       | theming                                                                                           |
| Building data tables                 | Using the separate data-table subpath with TanStack Table v9 and optional TanStack Virtual.                                            | data-table                                                                                        |
| Shipping safely                      | Checking peer dependencies, SSR/browser boundaries, accessibility conventions, and repository verification commands before production. | production-checklist                                                                              |

## Skill Inventory

| Skill                    | Type        | Domain                        | What it covers                                                                                  | Failure modes |
| ------------------------ | ----------- | ----------------------------- | ----------------------------------------------------------------------------------------------- | ------------- |
| getting-started          | lifecycle   | starting-svelte-apps          | install, theme CSS, peer deps, first imports, Svelte 5 patterns                                 | 3             |
| component-usage          | core        | using-component-groups        | public exports, component selection, compound namespaces, collection utilities                  | 3             |
| theming                  | core        | customizing-theme-and-styling | theme.css, Tailwind CSS 4, CSS variables, dark/light mode, class merging                        | 3             |
| forms-and-inputs         | core        | using-component-groups        | Field, Select, Combobox, Checkbox, Switch, NumberInput, date and phone inputs, Listbox          | 4             |
| overlays-and-floating-ui | core        | using-component-groups        | Dialog, AlertDialog, Drawer, Menu, Popover, HoverCard, Tooltip, Toast                           | 3             |
| layout-and-display       | core        | using-component-groups        | Card, Tabs, Splitter, Collapsible, ScrollArea, Avatar, Carousel, TreeView, JsonTreeView, Toggle | 3             |
| files-and-images         | core        | using-component-groups        | FileUpload, ImageCropper, ImageCropDialog, Canvas utilities, Blob/FormData flows                | 3             |
| data-table               | composition | building-data-tables          | compote-ui/data-table, TanStack Table v9, virtual table, columns, table state, toolbars         | 4             |
| production-checklist     | lifecycle   | shipping-safely               | peer audit, SSR audit, theme checks, accessibility checks, verification commands                | 3             |

## Failure Mode Inventory

### getting-started (3 failure modes)

| #   | Mistake                                   | Priority | Source                                                  | Cross-skill?    |
| --- | ----------------------------------------- | -------- | ------------------------------------------------------- | --------------- |
| 1   | Missing theme CSS import                  | CRITICAL | README.md, CLAUDE.md, src/lib/theme.css, existing skill | theming         |
| 2   | Using Svelte legacy props                 | HIGH     | CLAUDE.md, svelte.config.js                             | component-usage |
| 3   | Installing data table peers for every app | MEDIUM   | package.json, data-table reference                      | data-table      |

### component-usage (3 failure modes)

| #   | Mistake                                  | Priority | Source                                       | Cross-skill?            |
| --- | ---------------------------------------- | -------- | -------------------------------------------- | ----------------------- |
| 1   | Importing compound parts as root exports | HIGH     | src/lib/index.ts, references                 | forms, overlays, layout |
| 2   | Using arbitrary item shapes              | HIGH     | src/lib/utils/collections.ts, form reference | forms-and-inputs        |
| 3   | Icon-only button without label           | MEDIUM   | button reference, CLAUDE.md                  | production-checklist    |

### theming (3 failure modes)

| #   | Mistake                           | Priority | Source                       | Cross-skill?         |
| --- | --------------------------------- | -------- | ---------------------------- | -------------------- |
| 1   | Adding duplicate dark media block | HIGH     | CLAUDE.md, src/lib/theme.css | production-checklist |
| 2   | Styling colored text as white     | MEDIUM   | CLAUDE.md                    | component-usage      |
| 3   | Using primary for focus rings     | MEDIUM   | CLAUDE.md, src/lib/theme.css | component-usage      |

### forms-and-inputs (4 failure modes)

| #   | Mistake                                   | Priority | Source                               | Cross-skill?         |
| --- | ----------------------------------------- | -------- | ------------------------------------ | -------------------- |
| 1   | Using DatePicker as default date input    | HIGH     | form reference                       | component-usage      |
| 2   | Treating DateRangeField as DateField mode | HIGH     | form reference                       | component-usage      |
| 3   | Manually duplicating Field error text     | MEDIUM   | field implementation, form reference | component-usage      |
| 4   | Binding PhoneInput as local text          | MEDIUM   | form reference                       | production-checklist |

### overlays-and-floating-ui (3 failure modes)

| #   | Mistake                            | Priority | Source                                  | Cross-skill?     |
| --- | ---------------------------------- | -------- | --------------------------------------- | ---------------- |
| 1   | Expecting Dialog onClose prop      | HIGH     | images reference, dialog implementation | files-and-images |
| 2   | Manually composing Drawer backdrop | MEDIUM   | overlay reference                       | component-usage  |
| 3   | Forgetting app-level Toaster       | HIGH     | overlay reference                       | getting-started  |

### layout-and-display (3 failure modes)

| #   | Mistake                              | Priority | Source                    | Cross-skill?         |
| --- | ------------------------------------ | -------- | ------------------------- | -------------------- |
| 1   | Nesting Splitter wrapper             | HIGH     | layout reference          | component-usage      |
| 2   | Unconstrained ScrollArea or TreeView | MEDIUM   | layout/display references | production-checklist |
| 3   | Vertical carousel without height     | MEDIUM   | display reference         | component-usage      |

### files-and-images (3 failure modes)

| #   | Mistake                              | Priority | Source                                        | Cross-skill?         |
| --- | ------------------------------------ | -------- | --------------------------------------------- | -------------------- |
| 1   | Calling image utilities during SSR   | CRITICAL | src/lib/utils/image-processing.ts             | production-checklist |
| 2   | Using display-resolution crop output | HIGH     | images reference, ImageCropper implementation | component-usage      |
| 3   | Leaking object URLs                  | MEDIUM   | images reference                              | production-checklist |

### data-table (4 failure modes)

| #   | Mistake                                       | Priority | Source                                       | Cross-skill?         |
| --- | --------------------------------------------- | -------- | -------------------------------------------- | -------------------- |
| 1   | Missing id for accessorFn column              | CRITICAL | create-table.svelte.ts, data-table reference | production-checklist |
| 2   | Non-reactive reassigned columns               | HIGH     | data-table reference, playground example     | production-checklist |
| 3   | Rendering table without height constraint     | HIGH     | data-table reference, implementation         | layout-and-display   |
| 4   | Importing virtual table without optional peer | HIGH     | package.json, virtual implementation         | getting-started      |

### production-checklist (3 failure modes)

| #   | Mistake                                         | Priority | Source                             | Cross-skill?    |
| --- | ----------------------------------------------- | -------- | ---------------------------------- | --------------- |
| 1   | Skipping local verification                     | HIGH     | verify skill, CLAUDE.md            | all             |
| 2   | Assuming charts and editors are included        | MEDIUM   | maintainer interview               | component-usage |
| 3   | Forgetting component-specific peer dependencies | HIGH     | package.json, maintainer interview | data-table      |

## Tensions

| Tension                                       | Skills                                                          | Agent implication                                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Convenience wrappers versus Ark UI primitives | component-usage ↔ layout-and-display ↔ overlays-and-floating-ui | An agent may force the wrapper into an unsupported advanced composition instead of using Ark UI primitives directly. |
| Core install versus optional feature peers    | getting-started ↔ data-table ↔ production-checklist             | An agent may over-install dependencies for simple apps or under-install them for table/virtual usage.                |
| Theme defaults versus consumer overrides      | theming ↔ component-usage ↔ production-checklist                | An agent may hard-code colors or replace classes, breaking consumer theming.                                         |
| Browser utilities versus SSR apps             | files-and-images ↔ getting-started ↔ production-checklist       | An agent may call Canvas APIs in SvelteKit load functions or server modules.                                         |

## Cross-References

| From                 | To                       | Reason                                                                                     |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| getting-started      | theming                  | Initial setup is incomplete without theme.css and Tailwind token integration.              |
| getting-started      | production-checklist     | After setup, apps should audit peers, SSR boundaries, and accessibility before shipping.   |
| component-usage      | forms-and-inputs         | Many core usage questions involve value binding, collections, and validation forms.        |
| component-usage      | overlays-and-floating-ui | Overlay components are namespaced APIs with special composition rules.                     |
| component-usage      | layout-and-display       | Display and layout components have sizing constraints not obvious from imports alone.      |
| forms-and-inputs     | theming                  | Invalid, required, focus, and colored states rely on theme tokens.                         |
| files-and-images     | overlays-and-floating-ui | The recommended crop flow uses ImageCropDialog, which wraps Dialog behavior.               |
| data-table           | theming                  | Table checkboxes, pinned cells, and toolbar controls rely on Compote theme variables.      |
| production-checklist | data-table               | Optional peer dependency checks depend on whether data-table or virtual subpaths are used. |

## Subsystems & Reference Candidates

| Skill                    | Subsystems                                                 | Reference candidates                        |
| ------------------------ | ---------------------------------------------------------- | ------------------------------------------- |
| getting-started          | SvelteKit, Tailwind CSS 4                                  | install and peer dependency checklist       |
| component-usage          | root exports, namespaced components, utilities             | component reference matrix                  |
| theming                  | theme.css, Tailwind @theme inline, CSS variables           | token override reference                    |
| forms-and-inputs         | field wrappers, list collections, date inputs, phone input | form prop and value type matrix             |
| overlays-and-floating-ui | dialogs, drawers, floating panels, toast singleton         | overlay anatomy reference                   |
| layout-and-display       | layout wrappers, display widgets, interactive toggles      | sizing and anatomy reference                |
| files-and-images         | Ark UI file/image primitives, Canvas utilities             | image processing and upload flow reference  |
| data-table               | TanStack Table v9, TanStack Virtual                        | column options, cell renderers, table state |
| production-checklist     | peer deps, SSR boundaries, lint/check                      | production audit checklist                  |

## Resolved Maintainer Inputs

| Skill           | Question                                                                                                         | Status   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- | -------- |
| getting-started | Consumer install guidance should show both npm install and bun add; repo development still uses bun exclusively. | resolved |
| component-usage | Generated skills should be fewer, with component-group details moved into reference files.                       | resolved |
| theming         | Consumer setup should import tailwindcss first, then compote-ui/theme.css.                                       | resolved |
| data-table      | Do not add an explicit beta-risk warning to the DataTable skill.                                                 | resolved |

Additional maintainer findings:

- Component usage is the expected recurring support area.
- Virtual DataTable differs mainly by import path plus the optional `@tanstack/svelte-virtual` peer.
- Charts belong to `compote-echart`, not `compote-ui`.
- TipTap/editor functionality belongs to `compote-editor`, not `compote-ui`.

## Recommended Skill File Structure

- **Core skills:** component-usage, theming, forms-and-inputs, overlays-and-floating-ui, layout-and-display, files-and-images
- **Framework skills:** none beyond Svelte 5 assumptions; SvelteKit setup belongs in getting-started
- **Lifecycle skills:** getting-started, production-checklist
- **Composition skills:** data-table
- **Reference files:** keep dense references for component matrices, form value types, overlay anatomy, layout sizing, image processing, and data-table column options

## Composition Opportunities

| Library                  | Integration points                                                | Composition skill needed?                                  |
| ------------------------ | ----------------------------------------------------------------- | ---------------------------------------------------------- |
| SvelteKit                | app stylesheet import, root layout Toaster, SSR/client boundaries | yes, covered by getting-started and production-checklist   |
| Tailwind CSS 4           | theme.css import, @theme inline tokens, utility classes           | yes, covered by theming                                    |
| @ark-ui/svelte           | underlying accessible primitives and advanced escape hatches      | no separate skill initially; reference in component skills |
| @tanstack/svelte-table   | data-table createTable, features, columns, state                  | yes, data-table                                            |
| @tanstack/svelte-virtual | virtual table row windowing                                       | yes, covered inside data-table                             |
| @internationalized/date  | DateValue and date parsing helpers                                | no separate skill; covered by forms-and-inputs             |
| svelte-tel-input         | PhoneInput parsing, validation, flag CSS                          | no separate skill; covered by forms-and-inputs             |

## Docs Read

- AGENTS.md
- CLAUDE.md
- README.md
- package.json
- svelte.config.js
- .prettierrc
- src/lib/index.ts
- src/lib/theme.css
- src/routes/layout.css
- src/routes/nav-items.ts
- representative component, utility, data-table, virtual-table, and playground files
- existing global compote-ui skill and all eight reference files: button, form, overlay, layout, display, images, interactive, data-table

No useful public GitHub issue or discussion signal was found during search, and package.json does not define a repository or homepage field.
