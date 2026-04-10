<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaCornerBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaCornerBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<ScrollArea.Corner {...rest} class={cn('bg-transparent', className)} />
