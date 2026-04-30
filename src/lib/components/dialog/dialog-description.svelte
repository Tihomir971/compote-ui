<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogDescriptionBaseProps } from '@ark-ui/svelte/dialog';
	import type { ClassValue } from 'svelte/elements';

	interface Props extends DialogDescriptionBaseProps {
		class?: ClassValue;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Dialog.Description {...rest} class={className ?? 'mt-1 text-sm text-ink-dim'}>
	{@render children?.()}
</Dialog.Description>
