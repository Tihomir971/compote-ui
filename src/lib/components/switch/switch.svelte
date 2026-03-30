<script lang="ts">
	import { Switch, type SwitchRootBaseProps } from '@ark-ui/svelte/switch';

	interface Props extends SwitchRootBaseProps {
		labelSpacer?: boolean;
		layout?: 'vertical' | 'horizontal';
	}

	let { checked = $bindable(), label, labelSpacer = false, layout = 'horizontal', ...rootProps }: Props = $props();
	const rootClass = $derived(
		layout === 'vertical'
			? 'flex flex-col items-start gap-1 data-disabled:cursor-not-allowed data-disabled:opacity-50'
			: 'inline-flex cursor-pointer items-center gap-2 data-disabled:cursor-not-allowed data-disabled:opacity-50'
	);
</script>

{#if labelSpacer}
	<div style="height: calc(var(--ark-label-height) + var(--ark-field-gap))"></div>
{/if}
<Switch.Root {...rootProps} bind:checked class={rootClass}>
	<Switch.Control
		class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent bg-(--ark-track-bg) ring-offset-background transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-(--ark-ring) focus-visible:ring-offset-2 focus-visible:outline-hidden data-[state=checked]:bg-(--ark-primary)"
	>
		<Switch.Thumb
			class="pointer-events-none block size-5 rounded-full bg-(--ark-bg) shadow-sm ring-0 transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
		/>
	</Switch.Control>
	{#if label}
		<Switch.Label class="cursor-pointer select-none text-sm font-medium text-(--ark-foreground)">
			{label}
		</Switch.Label>
	{/if}
	<Switch.HiddenInput />
</Switch.Root>
