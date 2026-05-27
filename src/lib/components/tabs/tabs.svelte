<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import { ClientOnly } from '@ark-ui/svelte/client-only';
	import type { TabsProps } from './types';

	let {
		value = $bindable(),
		defaultValue,
		orientation = 'horizontal',
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
		{@render children?.()}
	</Tabs.Root>
</ClientOnly>
