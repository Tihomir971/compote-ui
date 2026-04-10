<script lang="ts">
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import type { CollapsibleTriggerBaseProps } from '@ark-ui/svelte/collapsible';
	import { cn } from 'tailwind-variants';

	interface Props extends CollapsibleTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Collapsible.Trigger
	{...rest}
	class={cn(
		'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-border bg-transparent px-3 py-2.5 text-start text-sm font-medium text-ink transition-colors outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-disabled:grayscale',
		className
	)}
>
	{@render children?.()}
</Collapsible.Trigger>
