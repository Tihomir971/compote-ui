<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaContentBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaContentBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<ScrollArea.Content {...rest} class={cn('', className)}>
	{@render children?.()}
</ScrollArea.Content>
