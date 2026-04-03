<script lang="ts">
	import { Checkbox } from '@ark-ui/svelte/checkbox';
	import type { CheckboxProps as Props } from './checkbox.types.ts';
	import PhCheck from '$lib/icons/PhCheck.svelte';
	import PhMinus from '$lib/icons/PhMinus.svelte';

	let { checked = $bindable(), label, children, ...rest }: Props = $props();
</script>

<Checkbox.Root
	bind:checked
	class="inline-flex cursor-pointer gap-2 {children ? 'items-start' : 'items-center'}"
	{...rest}
>
	<Checkbox.Control
		class="{children
			? 'mt-0.5'
			: ''} data-focus-visible:outline-ring flex size-5 shrink-0 items-center justify-center rounded-sm border bg-transparent transition-colors hover:border-primary/50 data-disabled:pointer-events-none data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-invalid:border-danger data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary"
	>
		<Checkbox.Indicator>
			<PhCheck class="size-3.5 text-ink-inverse" />
		</Checkbox.Indicator>
		<Checkbox.Indicator indeterminate>
			<PhMinus class="size-3.5 text-ink-inverse" />
		</Checkbox.Indicator>
	</Checkbox.Control>
	{#if label}
		<div class="flex flex-col gap-0.5">
			<Checkbox.Label class="text-base select-none data-disabled:opacity-50">
				{label}
			</Checkbox.Label>
			{#if children}
				<span class="text-sm text-ink-dim">
					{@render children()}
				</span>
			{/if}
		</div>
	{/if}
	<Checkbox.HiddenInput />
</Checkbox.Root>
