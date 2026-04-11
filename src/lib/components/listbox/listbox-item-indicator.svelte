<script lang="ts">
	import { Listbox } from '@ark-ui/svelte/listbox';
	import type { ListboxItemIndicatorBaseProps } from '@ark-ui/svelte/listbox';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';
	import { PhCheck } from '$lib/icons';

	type Props = ListboxItemIndicatorBaseProps & {
		class?: string;
		children?: Snippet;
	};

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Listbox.ItemIndicator
	{...restProps}
	class={cn(
		'flex h-3.5 w-3.5 shrink-0 items-center justify-center text-primary data-[state=unchecked]:hidden',
		className
	)}
>
	{#if children}{@render children()}{:else}<PhCheck />{/if}
</Listbox.ItemIndicator>
