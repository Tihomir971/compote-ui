<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselControlProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselControlProps & { children?: Snippet } = $props();
</script>

<Carousel.Control
	class={cn(
		'flex items-center gap-2 data-[justify=center]:justify-center data-[orientation=vertical]:flex-col',
		className
	)}
	{...rest}
>
	{@render children?.()}
</Carousel.Control>
