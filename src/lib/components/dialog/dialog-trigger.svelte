<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogTriggerBaseProps } from '@ark-ui/svelte/dialog';
	import type { ClassValue } from 'svelte/elements';

	interface Props extends DialogTriggerBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.Trigger {...rest} class={className}>
	{@render children?.()}
</Dialog.Trigger>
