<script lang="ts">
	import { Switch, type SwitchRootBaseProps } from '@ark-ui/svelte/switch';

	interface Props extends SwitchRootBaseProps {
		labelSpacer?: boolean;
		layout?: 'vertical' | 'horizontal';
	}

	let {
		checked = $bindable(),
		label,
		labelSpacer = false,
		layout = 'horizontal',
		...rootProps
	}: Props = $props();
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
		class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent bg-surface-3 transition-colors duration-150 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden data-invalid:ring-2 data-invalid:ring-danger data-invalid:ring-offset-2 data-[state=checked]:bg-primary"
	>
		<Switch.Thumb
			class="pointer-events-none block size-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-150 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
		/>
	</Switch.Control>
	{#if label}
		<Switch.Label class="cursor-pointer text-sm font-medium text-ink select-none">
			{label}
		</Switch.Label>
	{/if}
	<Switch.HiddenInput />
</Switch.Root>
