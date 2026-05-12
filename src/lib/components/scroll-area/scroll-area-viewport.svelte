<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaViewportBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaViewportBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ScrollArea.Viewport
	{...rest}
	class={cn(
		'h-full scrollbar-none overscroll-contain outline-none [&::-webkit-scrollbar]:hidden',
		'focus-visible:ring-2 focus-visible:ring-ring',
		className
	)}
>
	{@render children?.()}
</ScrollArea.Viewport>
