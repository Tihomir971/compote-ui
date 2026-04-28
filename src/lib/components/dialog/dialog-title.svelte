<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogTitleBaseProps } from '@ark-ui/svelte/dialog';

	interface Props extends DialogTitleBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.Title {...rest} class={className ?? 'text-lg font-semibold'}>
	{@render children?.()}
</Dialog.Title>
