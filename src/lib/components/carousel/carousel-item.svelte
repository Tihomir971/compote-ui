<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselItemProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselItemProps & { children?: Snippet } = $props();
</script>

<Carousel.Item class={cn('min-w-0 flex-[0_0_100%]', className)} {...rest}>
	{@render children?.()}
</Carousel.Item>
