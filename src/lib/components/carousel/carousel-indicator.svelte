<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselIndicatorProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		thumbnail = false,
		...rest
	}: CarouselIndicatorProps & { children?: Snippet; thumbnail?: boolean } = $props();
</script>

<Carousel.Indicator
	class={cn(
		thumbnail
			? 'size-16 cursor-pointer overflow-hidden rounded-md border-2 border-transparent opacity-60 transition-all data-current:border-primary data-current:opacity-100 [&_img]:h-full [&_img]:w-full [&_img]:object-contain [&_img]:p-1'
			: 'size-2 cursor-pointer rounded-full border-0 bg-surface-3 p-0 data-current:bg-primary',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Carousel.Indicator>
