<script lang="ts">
	import { ScrollArea } from '@ark-ui/svelte/scroll-area';
	import type { ScrollAreaThumbBaseProps } from '@ark-ui/svelte/scroll-area';
	import { cn } from 'tailwind-variants';

	interface Props extends ScrollAreaThumbBaseProps {
		class?: string;
	}

	let { class: className, ...rest }: Props = $props();
</script>

<ScrollArea.Thumb
	{...rest}
	class={cn(
		'w-full rounded-[inherit] bg-border',
		'group-data-[orientation=horizontal]:h-full group-data-[orientation=horizontal]:w-auto',
		className
	)}
/>
