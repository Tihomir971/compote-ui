<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import type { FieldRootProps } from './types';
	import { cn } from 'tailwind-variants';

	let {
		form,
		field,
		helperText,
		errorText,
		class: className,
		invalid,
		required,
		children,
		...rest
	}: FieldRootProps = $props();

	// Declared before isInvalid, which reads it.
	const resolvedError = $derived(
		form && field ? (form.errors[field]?.[0] ?? null) : (errorText ?? null)
	);
	// An error that does not also mark the field invalid renders nothing at all:
	// Ark's Field.ErrorText is gated on the field context's `invalid`. So a bare
	// `errorText` implies it, while an explicit `invalid` still wins.
	const isInvalid = $derived(form && field ? form.invalid(field) : (invalid ?? !!resolvedError));
	const isRequired = $derived(form && field ? form.isRequired(field) : (required ?? false));
</script>

<Field.Root
	{...rest}
	invalid={isInvalid}
	required={isRequired}
	class={cn('group flex flex-col gap-1.5', className)}
>
	{@render children?.()}
	{#if resolvedError}
		<Field.ErrorText>{resolvedError}</Field.ErrorText>
	{:else if helperText}
		<Field.HelperText>{helperText}</Field.HelperText>
	{:else}
		<!--
			Holds the message line open so a field does not change height when an
			error appears. `1lh` resolves against this element's own line-height, so
			it tracks the theme's font rather than assuming a pixel height. A plain
			div and not an empty Field.HelperText: Ark gives that one an id which
			aria-describedby points at, which would describe the control as having a
			description that isn't there.
		-->
		<div class="h-lh text-xs" aria-hidden="true"></div>
	{/if}
</Field.Root>
