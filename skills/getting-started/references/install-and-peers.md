# Install And Peers

Consumer apps may use either npm or bun:

```bash
npm install compote-ui
```

```bash
bun add compote-ui
```

Repository development uses bun exclusively:

```bash
bun install
bun run check
bun run lint
```

Peer dependency guidance:

- `svelte`: required, Svelte 5.
- `@tanstack/svelte-table`: required only for `compote-ui/data-table`.
- `@tanstack/svelte-virtual`: required only for `compote-ui/data-table/virtual`.

Consumer stylesheet setup:

```css
@import 'tailwindcss';
@import 'compote-ui/theme.css';
```

App-level toast setup:

```svelte
<script lang="ts">
	import { Toast } from 'compote-ui';

	let { children } = $props();
</script>

<Toast.Toaster />
{@render children()}
```
