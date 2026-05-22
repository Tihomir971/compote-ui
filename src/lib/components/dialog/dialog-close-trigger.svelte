<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import type { DialogCloseTriggerBaseProps } from '@ark-ui/svelte/dialog';
	import { PhX } from '$lib/icons';
	import {
		button,
		type ButtonVariant,
		type ButtonSize
	} from '$lib/components/button/button.variants';
	import type { ClassValue } from 'tailwind-variants';

	interface Props extends DialogCloseTriggerBaseProps {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: ClassValue;
	}

	let { class: className, variant, size, children, ...rest }: Props = $props();

	const isIconMode = $derived(!children);

	const classes = $derived(
		isIconMode
			? button({
					variant: variant ?? 'ghost',
					size: size ?? 'icon-sm',
					class: [
						'absolute top-3 right-3 opacity-70 hover:opacity-100 active:opacity-50',
						className
					]
				})
			: button({
					variant: variant ?? 'outline',
					size: size ?? 'default',
					class: className
				})
	);
</script>

<Dialog.CloseTrigger {...rest} class={classes}>
	{#if children}
		{@render children()}
	{:else}
		<PhX class="size-4" />
		<span class="sr-only">Close</span>
	{/if}
</Dialog.CloseTrigger>
