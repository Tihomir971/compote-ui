<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabContentBaseProps } from '@ark-ui/svelte/tabs';

	interface Props extends TabContentBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Tabs.Content
	{...rest}
	class={className ??
		'flex-1 pt-4 outline-none data-[orientation=vertical]:pt-0 data-[orientation=vertical]:pl-4'}
>
	{@render children?.()}
</Tabs.Content>
