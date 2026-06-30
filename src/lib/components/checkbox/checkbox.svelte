<script lang="ts">
	import { Checkbox } from '@ark-ui/svelte/checkbox';
	import { cn } from 'tailwind-variants';
	import type { CheckboxProps as Props } from './checkbox.types.ts';
	import { PhCheck, PhMinus } from '$lib/icons';

	let {
		checked = $bindable(),
		label,
		children,
		size = 'md',
		class: className,
		...rest
	}: Props = $props();

	const checkboxSize = {
		sm: {
			control: 'size-4',
			icon: 'size-3'
		},
		md: {
			control: 'size-5',
			icon: 'size-3.5'
		}
	};
</script>

<Checkbox.Root
	bind:checked
	class={cn(
		'inline-flex cursor-pointer gap-2 leading-none',
		children ? 'items-start' : 'items-center',
		className
	)}
	{...rest}
>
	<Checkbox.Control
		class={cn(
			children ? 'mt-0.5' : '',
			checkboxSize[size].control,
			'relative grid shrink-0 place-items-center rounded-sm border bg-transparent transition-colors hover:border-primary/50 data-disabled:pointer-events-none data-disabled:opacity-50 data-focus-visible:outline-2 data-focus-visible:outline-offset-2 data-focus-visible:outline-ring data-invalid:border-danger data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary'
		)}
	>
		<Checkbox.Indicator class="absolute inset-0 grid place-items-center leading-none">
			<PhCheck class={cn(checkboxSize[size].icon, 'block text-ink-inverse')} />
		</Checkbox.Indicator>
		<Checkbox.Indicator indeterminate class="absolute inset-0 grid place-items-center leading-none">
			<PhMinus class={cn(checkboxSize[size].icon, 'block text-ink-inverse')} />
		</Checkbox.Indicator>
	</Checkbox.Control>
	{#if label}
		<div class="flex flex-col gap-0.5">
			<Checkbox.Label class="text-sm select-none data-disabled:opacity-50">
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
