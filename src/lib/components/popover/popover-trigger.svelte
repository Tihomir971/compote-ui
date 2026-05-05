<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
	import type { PopoverTriggerBaseProps } from '@ark-ui/svelte/popover';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends PopoverTriggerBaseProps {
		class?: ClassValue;
		children: Snippet;
	}

	let { class: className, children, ...restProps }: Props = $props();
</script>

<Popover.Trigger class={className} {...restProps}>
	{@render children()}
</Popover.Trigger>
