<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldRootProps } from './types';
	import { cn } from 'tailwind-variants';

	let {
		form,
		field,
		helperText,
		class: className,
		invalid,
		required,
		children,
		...rest
	}: FieldRootProps = $props();

	const isInvalid = $derived(form && field ? form.invalid(field) : (invalid ?? false));
	const isRequired = $derived(form && field ? form.isRequired(field) : (required ?? false));
	const errorText = $derived(form && field ? (form.errors[field]?.[0] ?? null) : null);
</script>

<Field.Root
	{...rest}
	invalid={isInvalid}
	required={isRequired}
	class={cn('group flex flex-col gap-1.5', className)}
>
	{@render children?.()}
	{#if errorText}
		<Field.ErrorText>{errorText}</Field.ErrorText>
	{:else if helperText}
		<Field.HelperText>{helperText}</Field.HelperText>
	{/if}
</Field.Root>
