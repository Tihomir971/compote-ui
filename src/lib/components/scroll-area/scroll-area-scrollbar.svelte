<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaScrollbarBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaScrollbarBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ScrollArea.Scrollbar
	{...rest}
	class={cn(
		'group pointer-events-none relative m-2 flex rounded-md bg-well opacity-0 transition-opacity duration-150',
		'data-hover:pointer-events-auto data-hover:opacity-100',
		'data-scrolling:pointer-events-auto data-scrolling:opacity-100 data-scrolling:duration-0',
		'data-[orientation=vertical]:w-1 data-[orientation=vertical]:[&:not([data-overflow-y])]:hidden',
		'data-[orientation=vertical]:before:absolute data-[orientation=vertical]:before:left-1/2 data-[orientation=vertical]:before:h-full data-[orientation=vertical]:before:w-5 data-[orientation=vertical]:before:-translate-x-1/2 data-[orientation=vertical]:before:content-[""]',
		'data-[orientation=horizontal]:h-1 data-[orientation=horizontal]:[&:not([data-overflow-x])]:hidden',
		'data-[orientation=horizontal]:before:absolute data-[orientation=horizontal]:before:-bottom-2 data-[orientation=horizontal]:before:left-0 data-[orientation=horizontal]:before:h-5 data-[orientation=horizontal]:before:w-full data-[orientation=horizontal]:before:content-[""]',
		className
	)}
>
	{@render children?.()}
</ScrollArea.Scrollbar>
