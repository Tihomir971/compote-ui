<script lang="ts">
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import type { CollapsibleIndicatorBaseProps } from '@ark-ui/svelte/collapsible';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';
	import PhCaretRight from '../../icons/PhCaretRight.svelte';

	interface Props extends CollapsibleIndicatorBaseProps {
		class?: string;
		children?: Snippet;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Collapsible.Indicator
	{...rest}
	class={cn(
		'inline-flex items-center justify-center transition-transform duration-120 ease-in data-[state=open]:rotate-90',
		className
	)}
>
	{#if children}
		{@render children()}
	{:else}
		<PhCaretRight class="size-4" />
	{/if}
</Collapsible.Indicator>
