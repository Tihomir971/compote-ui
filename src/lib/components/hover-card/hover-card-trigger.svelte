<script lang="ts">
	import { HoverCard } from '@ark-ui/svelte/hover-card';
	import type { HoverCardTriggerProps } from '@ark-ui/svelte/hover-card';

	type Props = Omit<HoverCardTriggerProps, 'class'> & {
		class?: string;
	};

	const { class: className, children, ...restProps }: Props = $props();
</script>

<HoverCard.Trigger class={className} {...restProps}>
	{@render children?.()}
</HoverCard.Trigger>
