<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabIndicatorBaseProps } from '@ark-ui/svelte/tabs';
	import { cn } from 'tailwind-variants';

	interface Props extends TabIndicatorBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<!-- Ark positions a horizontal indicator with `left` only; `top-(--top)` follows the selected
     trigger onto its row when the list wraps (flex-wrap). -->
<Tabs.Indicator
	{...rest}
	class={cn(
		"absolute -z-10 rounded-md bg-surface-2 transition-[width,height,left,top] duration-200 ease-out data-[orientation='horizontal']:top-(--top) data-[orientation='horizontal']:h-8 data-[orientation='horizontal']:w-(--width) data-[orientation='vertical']:h-(--height) data-[orientation='vertical']:w-full",
		className
	)}
/>
