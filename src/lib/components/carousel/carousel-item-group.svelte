<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselItemGroupProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselItemGroupProps & { children?: Snippet } = $props();
</script>

<Carousel.ItemGroup
	class={cn(
		'flex min-w-0 flex-1 overflow-hidden rounded-lg [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Carousel.ItemGroup>
