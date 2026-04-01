<script lang="ts">
	import { Tabs } from '@ark-ui/svelte/tabs';
	import type { TabTriggerBaseProps } from '@ark-ui/svelte/tabs';

	interface Props extends TabTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Tabs.Trigger
	{...rest}
	class={className ??
		'inline-flex h-8 items-center justify-center gap-2 rounded-md bg-transparent px-3 text-sm whitespace-nowrap text-ink-dim transition-colors outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 data-selected:font-medium data-selected:text-ink data-[orientation=vertical]:w-full data-[orientation=vertical]:justify-start data-[orientation=vertical]:py-2'}
>
	{@render children?.()}
</Tabs.Trigger>
