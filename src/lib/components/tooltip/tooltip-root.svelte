<script lang="ts">
	import { Tooltip } from '@ark-ui/svelte/tooltip';
	import type { TooltipRootBaseProps } from '@ark-ui/svelte/tooltip';
	import type { Snippet } from 'svelte';

	type Props = TooltipRootBaseProps & {
		children?: Snippet;
	};

	const { children, ...restProps }: Props = $props();
</script>

<Tooltip.Root {...restProps}>
	{@render children?.()}
</Tooltip.Root>
