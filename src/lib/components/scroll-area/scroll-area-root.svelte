<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaRootBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaRootBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ScrollArea.Root
	{...rest}
	class={cn('relative overflow-hidden', className)}
	onscroll={(event) => {
		// The root is a clipping container and must never scroll — the viewport is
		// the scroller. Browsers can still scroll an overflow:hidden ancestor to
		// reveal a focused descendant, which pushes the viewport out of view and
		// leaves a blank area. Snap it back to 0.
		const el = event.currentTarget;
		if (el.scrollTop !== 0 || el.scrollLeft !== 0) {
			el.scrollTop = 0;
			el.scrollLeft = 0;
		}
	}}
>
	{@render children?.()}
</ScrollArea.Root>
