<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldTextareaProps } from './types';
	import { cn } from 'tailwind-variants';

	let { class: className, value = $bindable(), ...rest }: FieldTextareaProps = $props();
</script>

<Field.Textarea
	{...rest}
	{value}
	class={cn(
		'flex min-h-20 w-full resize-y rounded-md border bg-surface-1 px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-ink-dim focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger data-invalid:focus-visible:ring-danger data-readonly:cursor-default data-readonly:opacity-70',
		className
	)}
/>
