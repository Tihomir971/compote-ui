<script lang="ts">
	import PhArrowLeft from '$lib/icons/PhArrowLeft.svelte';
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselPrevTriggerProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselPrevTriggerProps & { children?: Snippet } = $props();
</script>

<Carousel.PrevTrigger
	class={cn(
		'inline-flex size-9 items-center justify-center rounded-md border bg-surface-1 shadow-sm hover:bg-surface-2 active:bg-surface-3 disabled:opacity-50',
		className
	)}
	{...rest}
>
	{#if children}
		{@render children()}
	{:else}
		<PhArrowLeft class="size-4" />
	{/if}
</Carousel.PrevTrigger>
