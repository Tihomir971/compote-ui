<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldInputProps } from './types';
	import { cn } from 'tailwind-variants';

	let {
		class: className,
		value = $bindable(),
		startIcon,
		endIcon,
		...rest
	}: FieldInputProps = $props();
</script>

<div class="relative w-full">
	{#if startIcon}
		<div
			class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-ink-dim"
		>
			{@render startIcon()}
		</div>
	{/if}
	<Field.Input
		{...rest}
		bind:value
		class={cn(
			'flex h-9 w-full rounded-md border bg-surface-1 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-ink-dim focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger data-invalid:focus-visible:ring-danger data-readonly:cursor-default data-readonly:opacity-70',
			startIcon && 'pl-9',
			endIcon && 'pr-9',
			className
		)}
	/>
	{#if endIcon}
		<div class="absolute inset-y-0 right-0 flex items-center pr-2.5">
			{@render endIcon()}
		</div>
	{/if}
</div>
