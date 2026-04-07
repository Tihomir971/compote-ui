<script lang="ts">
	import { Carousel } from '@ark-ui/svelte/carousel';
	import type { CarouselRootProps } from '@ark-ui/svelte/carousel';
	import { cn } from 'tailwind-variants';
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		...rest
	}: CarouselRootProps & { children?: Snippet } = $props();
</script>

<Carousel.Root
	class={cn('flex flex-col gap-2 data-[orientation=vertical]:flex-row data-[orientation=vertical]:h-80', className)}
	{...rest}
>
	{@render children?.()}
</Carousel.Root>
