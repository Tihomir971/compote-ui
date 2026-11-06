<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabListBaseProps } from '@ark-ui/svelte/tabs';
	import { cn } from 'tailwind-variants';

	interface Props extends TabListBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Tabs.List
	{...rest}
	class={cn(
		"relative isolate inline-flex gap-1 data-[orientation='horizontal']:flex-row data-[orientation='vertical']:flex-col",
		className
	)}
>
	{@render children?.()}
</Tabs.List>
