<script lang="ts">
	import { DateInput } from '@ark-ui/svelte/date-input';
	import { Field } from '@ark-ui/svelte/field';
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import type { DateInputProps } from './types';

	let {
		value = $bindable(),
		defaultValue,
		label,
		name,
		onValueChange,
		...restProps
	}: DateInputProps = $props();

	const locale = useLocaleContext();
</script>

<DateInput.Root
	{...restProps}
	locale={locale().locale}
	value={value ? [value] : []}
	defaultValue={defaultValue ? [defaultValue] : undefined}
	onValueChange={(details) => {
		value = details.value[0] ?? null;
		onValueChange?.(details);
	}}
>
	{#if label}
		<DateInput.Label class="text-sm font-medium leading-none">
			{label}
			<Field.RequiredIndicator />
		</DateInput.Label>
	{/if}
	<DateInput.Control>
		<DateInput.SegmentGroup
			class="inline-flex h-9 items-center rounded-md border border-border bg-surface-1 px-3 text-sm shadow-sm focus-within:ring-1 focus-within:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-invalid:border-danger"
		>
			<DateInput.SegmentContext>
				{#snippet render(segment)}
					<DateInput.Segment
						{segment}
						class="rounded px-0.5 text-ink outline-none focus:bg-primary focus:text-ink-inverse data-placeholder-shown:text-ink-dim"
					/>
				{/snippet}
			</DateInput.SegmentContext>
		</DateInput.SegmentGroup>
	</DateInput.Control>
	<DateInput.HiddenInput {name} />
</DateInput.Root>
