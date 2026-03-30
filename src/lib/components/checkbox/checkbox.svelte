<script lang="ts">
	import { Checkbox } from '@ark-ui/svelte/checkbox';
	import type { CheckboxProps as Props } from './checkbox.types.ts';
	import PhCheck from '$lib/icons/PhCheck.svelte';

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
			: ''} flex size-5 shrink-0 items-center justify-center rounded-sm border border-border bg-transparent transition-colors data-disabled:pointer-events-none data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring data-[state=checked]:border-primary data-[state=checked]:bg-primary"
	>
		<Checkbox.Indicator>
			<PhCheck class="size-3.5 text-primary-foreground" />
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
