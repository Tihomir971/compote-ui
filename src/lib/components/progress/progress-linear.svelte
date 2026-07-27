<script lang="ts">
	import { Progress } from '@ark-ui/svelte/progress';
	import { cn } from 'tailwind-variants';
	import type { ProgressLinearProps, ProgressSize, ProgressVariant } from './types';

	let {
		value = $bindable(),
		label,
		showValueText = false,
		size = 'md',
		variant = 'primary',
		class: className,
		...rootProps
	}: ProgressLinearProps = $props();

	const trackHeight: Record<ProgressSize, string> = {
		sm: 'h-1',
		md: 'h-2',
		lg: 'h-3'
	};

	const rangeColor: Record<ProgressVariant, string> = {
		primary: 'bg-primary',
		success: 'bg-success',
		danger: 'bg-danger',
		warning: 'bg-warning',
		info: 'bg-info'
	};
</script>

<Progress.Root bind:value {...rootProps} class={cn('flex w-full flex-col gap-1.5', className)}>
	{#if label || showValueText}
		<div class="flex items-center justify-between gap-2">
			{#if label}
				<Progress.Label class="text-sm font-medium text-ink">{label}</Progress.Label>
			{/if}
			{#if showValueText}
				<Progress.ValueText class="text-sm text-ink-dim tabular-nums" />
			{/if}
		</div>
	{/if}
	<Progress.Track class={cn('w-full overflow-hidden rounded-full bg-surface-3', trackHeight[size])}>
		<Progress.Range
			class={cn(
				'h-full rounded-full transition-[width] duration-300 ease-out',
				'data-[state=indeterminate]:w-2/5 data-[state=indeterminate]:animate-[compote-progress-indeterminate_1.2s_ease-in-out_infinite]',
				rangeColor[variant]
			)}
		/>
	</Progress.Track>
</Progress.Root>
