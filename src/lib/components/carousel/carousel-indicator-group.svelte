<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselIndicatorGroupProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselIndicatorGroupProps & { children?: Snippet } = $props();
</script>

<Carousel.IndicatorGroup
	class={cn('flex justify-center gap-2 data-[orientation=vertical]:flex-col', className)}
	{...rest}
>
	{@render children?.()}
</Carousel.IndicatorGroup>
