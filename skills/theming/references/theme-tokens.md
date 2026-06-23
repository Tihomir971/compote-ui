# Theme Tokens

Primary CSS variables:

```css
:root {
	--radius: 6px;
	--font-sans: 'Nunito Sans Variable', sans-serif;
	--font-serif: Merriweather, serif;
	--font-mono: Fira Code, monospace;

	--compote-ink: light-dark(var(--gray-15), var(--gray-1));
	--compote-ink-dim: light-dark(var(--gray-11), var(--gray-5));
	--compote-ink-inverse: white;
	--compote-surface-3: light-dark(var(--gray-5), var(--gray-10));
	--compote-surface-2: light-dark(var(--gray-4), var(--gray-12));
	--compote-surface-1: light-dark(var(--gray-3), var(--gray-13));
	--compote-surface-document: light-dark(var(--gray-2), var(--gray-14));
	--compote-well: light-dark(var(--gray-1), var(--gray-15));

	--compote-primary: oklch(from var(--color-7) l c var(--hue-orange));
	--compote-danger: oklch(from var(--color-7) l c var(--hue-red));
	--compote-warning: oklch(from var(--color-7) l c var(--hue-yellow));
	--compote-success: oklch(from var(--color-7) l c var(--hue-green));
	--compote-info: oklch(from var(--color-7) l c var(--hue-blue));

	--compote-border: var(--compote-surface-3);
	--compote-ring: var(--compote-primary);
}
```

Tailwind utility mapping from `@theme inline`:

- `text-ink`
- `text-ink-dim`
- `text-ink-inverse`
- `bg-surface-1`
- `bg-surface-2`
- `bg-surface-3`
- `bg-surface-document`
- `bg-well`
- `bg-primary`, `text-primary`
- `border-border`
- `ring-ring`

Dark/light control:

```css
.dark {
	color-scheme: dark;
}

.light {
	color-scheme: light;
}
```
