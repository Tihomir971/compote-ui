<script lang="ts">
	import { Field } from '@ark-ui/svelte/field';
	import { PasswordInput } from '@ark-ui/svelte/password-input';
	import type { PasswordInputProps } from './types';
	import { PhEye, PhEyeSlash } from '$lib/icons';

	let {
		label,
		layout = 'vertical',
		placeholder,
		class: className,
		...restProps
	}: PasswordInputProps = $props();

	const rootClass = $derived(
		layout === 'horizontal'
			? 'flex items-center justify-between gap-1.5 w-full data-disabled:opacity-50 data-disabled:grayscale'
			: 'flex flex-col gap-1.5 w-full max-w-72 data-disabled:opacity-50 data-disabled:grayscale'
	);
</script>

<PasswordInput.Root {...restProps} class={className ? `${rootClass} ${className}` : rootClass}>
	{#if label}
		<PasswordInput.Label class="text-sm leading-none font-medium">
			{label}
			<Field.RequiredIndicator />
		</PasswordInput.Label>
	{/if}
	<PasswordInput.Control class="relative isolate">
		<PasswordInput.Input
			{placeholder}
			class="h-9 w-full rounded-md border bg-surface-1 px-3 pr-9 text-sm shadow-sm placeholder:text-ink-dim focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none data-invalid:border-danger data-invalid:focus-visible:ring-danger"
		/>
		<PasswordInput.VisibilityTrigger
			class="absolute top-1/2 right-2 -translate-y-1/2 text-ink-dim hover:text-ink focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		>
			<PasswordInput.Indicator class="flex items-center justify-center">
				{#snippet fallback()}
					<PhEyeSlash class="size-4" />
				{/snippet}
				<PhEye class="size-4" />
			</PasswordInput.Indicator>
		</PasswordInput.VisibilityTrigger>
	</PasswordInput.Control>
</PasswordInput.Root>
