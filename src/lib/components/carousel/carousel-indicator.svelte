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
			? 'flex size-16 cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-transparent opacity-60 transition-all data-current:border-primary data-current:opacity-100 [&_img]:size-14 [&_img]:max-w-full [&_img]:object-contain'
			: 'size-2 cursor-pointer rounded-full border-0 bg-surface-3 p-0 data-current:bg-primary',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Carousel.Indicator>
