<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import { ClientOnly } from '@ark-ui/svelte/client-only';
	import type { TabsProps } from './types';

	let {
		indicator = false,
		value = $bindable(),
		defaultValue,
		orientation = 'horizontal',
		triggers,
		children,
		...rootProps
	}: TabsProps = $props();
</script>

<ClientOnly>
	<Tabs.Root
		{...rootProps}
		bind:value
		{defaultValue}
		{orientation}
		class="flex data-[orientation='horizontal']:flex-col data-[orientation='vertical']:flex-row"
	>
		<Tabs.List
			class="relative isolate inline-flex gap-1 data-[orientation='horizontal']:flex-row data-[orientation='vertical']:flex-col"
		>
			{#if triggers}
				{@render triggers()}
			{/if}
			{#if indicator}
				<Tabs.Indicator
					class="absolute -z-10 rounded-md bg-surface-2 transition-[width,height,left,top] duration-200 ease-out data-[orientation='horizontal']:h-8 data-[orientation='horizontal']:w-(--width) data-[orientation='vertical']:h-(--height) data-[orientation='vertical']:w-full"
				/>
			{/if}
		</Tabs.List>
		{@render children?.()}
	</Tabs.Root>
</ClientOnly>
