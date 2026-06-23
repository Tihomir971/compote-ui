# Production Audit

Commands for repository changes:

```bash
bun run check
bun run lint
```

Theme:

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';
```

Data table peers:

- `compote-ui/data-table` needs `@tanstack/svelte-table`.
- `compote-ui/data-table/virtual` needs `@tanstack/svelte-virtual`.

Browser-only APIs:

- `loadImage`
- `fileToDataUrl`
- `cropImage`
- `processImage`

Do not call these in SvelteKit server modules or `load` functions.

Accessibility:

- Icon-only buttons need `aria-label`.
- Data tables should have `caption`.
- Dialogs should include `Dialog.Title`.

Package boundaries:

- Charts: `compote-echart`.
- TipTap editor: `compote-editor`.
