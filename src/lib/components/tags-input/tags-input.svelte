<script lang="ts">
	import { TagsInput } from '@ark-ui/svelte/tags-input';
	import { useFieldContext } from '@ark-ui/svelte/field';
	import { cn } from 'tailwind-variants';
	import type { TagsInputProps } from './types';
	import { PhX } from '$lib/icons';

	let {
		value = $bindable(),
		label,
		placeholder,
		invalid,
		readOnly,
		disabled,
		class: className,
		...restProps
	}: TagsInputProps = $props();

	const field = useFieldContext();
	const isInvalid = $derived(invalid ?? field?.()?.invalid ?? false);
	const isReadOnly = $derived(readOnly ?? field?.()?.readOnly ?? false);
	const isDisabled = $derived(disabled ?? field?.()?.disabled ?? false);
</script>

<TagsInput.Root
	bind:value
	invalid={isInvalid}
	readOnly={isReadOnly}
	disabled={isDisabled}
	{...restProps}
	class={cn('grid gap-1.5', className)}
>
	<TagsInput.Context>
		{#snippet render(tagsInput)}
			{#if label}
				<TagsInput.Label class="text-sm leading-none font-medium data-disabled:opacity-50">
					{label}
				</TagsInput.Label>
			{/if}

			<TagsInput.Control
				class={cn(
					'flex min-h-9 flex-wrap items-center gap-1 rounded border bg-surface-1 px-2 py-1 shadow-sm',
					'focus-within:ring-1 focus-within:ring-ring',
					'data-disabled:pointer-events-none data-disabled:opacity-50',
					'data-invalid:border-danger data-invalid:focus-within:ring-danger'
				)}
			>
				{#each tagsInput().value as value, index (index)}
					<TagsInput.Item
						{index}
						{value}
						class="inline-flex cursor-default items-center outline-none"
					>
						<TagsInput.ItemPreview
							class={cn(
								'inline-flex items-center gap-1 rounded bg-surface-2 py-0.5 pr-1 pl-2 text-sm',
								'data-disabled:opacity-50 data-highlighted:bg-primary/10'
							)}
						>
							<TagsInput.ItemText>{value}</TagsInput.ItemText>
							{#if !isReadOnly}
								<TagsInput.ItemDeleteTrigger
									class="rounded p-0.5 text-ink-dim transition-colors hover:text-ink"
								>
									<PhX class="size-3" />
								</TagsInput.ItemDeleteTrigger>
							{/if}
						</TagsInput.ItemPreview>
						<TagsInput.ItemInput
							class="rounded border bg-surface-1 px-2 py-0.5 text-sm outline-none"
						/>
					</TagsInput.Item>
				{/each}
				<TagsInput.Input
					{placeholder}
					class="min-w-12 flex-1 bg-transparent text-sm outline-none placeholder:text-ink-dim disabled:cursor-not-allowed"
				/>
			</TagsInput.Control>
		{/snippet}
	</TagsInput.Context>
	<TagsInput.HiddenInput />
</TagsInput.Root>
