<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogDescriptionBaseProps } from '@ark-ui/svelte/dialog';

	interface Props extends DialogDescriptionBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.Description {...rest} class={className ?? 'mt-1 text-sm text-ink-dim'}>
	{@render children?.()}
</Dialog.Description>
