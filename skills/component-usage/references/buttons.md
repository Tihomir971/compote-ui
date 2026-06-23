# Buttons

```svelte
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Settings">
	<SettingsIcon class="size-4" />
</Button>
<Button disabled>Disabled</Button>
```

`Button` props:

- `variant?: 'default' | 'outline' | 'ghost'`
- `size?: 'sm' | 'default' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg'`
- `class?: ClassValue`
- standard button attributes such as `onclick`, `disabled`, `type`

Use `LinkButton` for navigation links that should look like buttons:

```svelte
<LinkButton href="/dashboard">Dashboard</LinkButton>
<LinkButton href="https://example.com" variant="outline" target="_blank">External</LinkButton>
```
