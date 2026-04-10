<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaRootBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaRootBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ScrollArea.Root {...rest} class={cn('relative overflow-hidden', className)}>
	{@render children?.()}
</ScrollArea.Root>
