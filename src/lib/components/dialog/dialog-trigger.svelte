<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogTriggerBaseProps } from '@ark-ui/svelte/dialog';

	interface Props extends DialogTriggerBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.Trigger {...rest} class={className}>
	{@render children?.()}
</Dialog.Trigger>
