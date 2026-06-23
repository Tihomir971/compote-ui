# Layout And Display

Tabs:

```svelte
<Tabs.Root bind:value={tab} defaultValue="account">
	<Tabs.List>
		<Tabs.Trigger value="account">Account</Tabs.Trigger>
		<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
		<Tabs.Indicator />
	</Tabs.List>
	<Tabs.Content value="account">Account content</Tabs.Content>
	<Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs.Root>
```

Splitter fills its container:

```svelte
<div class="h-64">
	{#snippet left()}
		<div class="p-3">Left</div>
	{/snippet}
	{#snippet right()}
		<div class="p-3">Right</div>
	{/snippet}

	<Splitter
		panels={[
			{ id: 'left', minSize: 20, content: left },
			{ id: 'right', minSize: 20, content: right }
		]}
	/>
</div>
```

For nested splitters, use Ark UI directly with one shared registry:

```svelte
<script lang="ts">
	import { Splitter } from '@ark-ui/svelte/splitter';

	const registry = Splitter.createRegistry();
</script>
```

ScrollArea needs explicit size:

```svelte
<ScrollArea.Root class="h-80 w-56">
	<ScrollArea.Viewport>
		<ScrollArea.Content class="p-3">Content</ScrollArea.Content>
	</ScrollArea.Viewport>
	<ScrollArea.Scrollbar orientation="vertical">
		<ScrollArea.Thumb />
	</ScrollArea.Scrollbar>
</ScrollArea.Root>
```

Vertical Carousel needs explicit height:

```svelte
<Carousel.Root orientation="vertical" class="h-[512px]" slideCount={images.length}>
	<Carousel.Control>
		<Carousel.ItemGroup>
			{#each images as image, index (image.src)}
				<Carousel.Item {index}>
					<img src={image.src} alt={image.alt} class="h-full w-full object-cover" />
				</Carousel.Item>
			{/each}
		</Carousel.ItemGroup>
	</Carousel.Control>
</Carousel.Root>
```

TreeView fills its container:

```svelte
<div class="h-80 rounded border">
	<TreeView {items} label="Files" bind:selectedValue={selected} />
</div>
```
