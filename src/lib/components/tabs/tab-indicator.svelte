<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabIndicatorBaseProps } from '@ark-ui/svelte/tabs';

	interface Props extends TabIndicatorBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<Tabs.Indicator
	{...rest}
	class={className ??
		"absolute -z-10 rounded-md bg-surface-2 transition-[width,height,left,top] duration-200 ease-out data-[orientation='horizontal']:h-8 data-[orientation='horizontal']:w-(--width) data-[orientation='vertical']:h-(--height) data-[orientation='vertical']:w-full"}
/>
