# Interactive Components

Use `Toggle` for one standalone binary action:

```svelte
<script lang="ts">
	let favorite = $state(false);
</script>

<Toggle bind:pressed={favorite} aria-label="Toggle favorite">Favorite</Toggle>
```

Use `ToggleGroup` for toolbar-style groups:

```svelte
<script lang="ts">
	let alignment = $state(['left']);
</script>

<ToggleGroup.Root bind:value={alignment} icon>
	<ToggleGroup.Item value="left">
		<AlignLeft />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="center">
		<AlignCenter />
	</ToggleGroup.Item>
	<ToggleGroup.Item value="right">
		<AlignRight />
	</ToggleGroup.Item>
</ToggleGroup.Root>
```

`Toggle` defaults to `variant="ghost"`. `ToggleGroup` defaults to `variant="outline"`.
