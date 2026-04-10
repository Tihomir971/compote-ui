<script lang="ts">
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import type { CollapsibleRootBaseProps } from '@ark-ui/svelte/collapsible';
	import { cn } from 'tailwind-variants';

	interface Props extends CollapsibleRootBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Collapsible.Root {...rest} class={cn('w-full', className)}>
	{@render children?.()}
</Collapsible.Root>
