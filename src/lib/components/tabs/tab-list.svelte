<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabListBaseProps } from '@ark-ui/svelte/tabs';

	interface Props extends TabListBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Tabs.List
	{...rest}
	class={className ??
		"relative isolate inline-flex gap-1 data-[orientation='horizontal']:flex-row data-[orientation='vertical']:flex-col"}
>
	{@render children?.()}
</Tabs.List>
