<script lang="ts">
	import { Progress } from '@ark-ui/svelte/progress';
	import type { ProgressCircularProps, ProgressSize, ProgressVariant } from './types';

	let {
		value = $bindable(),
		label,
		showValueText = false,
		size = 'md',
		thickness,
		variant = 'primary',
		class: className,
		...rootProps
	}: ProgressCircularProps = $props();

	const sizeMap: Record<ProgressSize, number> = {
		sm: 40,
		md: 64,
		lg: 96
	};

	const px = $derived(typeof size === 'number' ? size : sizeMap[size]);
	const stroke = $derived(thickness ?? Math.max(3, Math.round(px / 10)));

	const strokeColor: Record<ProgressVariant, string> = {
		primary: 'stroke-primary',
		success: 'stroke-success',
		danger: 'stroke-danger',
		warning: 'stroke-warning',
		info: 'stroke-info'
	};
</script>

<Progress.Root bind:value {...rootProps} class={className}>
	<div class="inline-flex flex-col items-center gap-2">
		<div class="relative inline-flex items-center justify-center">
			<Progress.Circle
				class="data-[state=indeterminate]:animate-spin"
				style="--size: {px}px; --thickness: {stroke}px"
			>
				<Progress.CircleTrack class="stroke-surface-3" />
				<Progress.CircleRange
					class={[
						'transition-[stroke-dashoffset] duration-300 ease-out',
						'data-[state=indeterminate]:[stroke-dasharray:calc(var(--circumference)*0.25)_var(--circumference)]! data-[state=indeterminate]:[stroke-dashoffset:0]!',
						strokeColor[variant]
					]}
				/>
			</Progress.Circle>
			{#if showValueText}
				<Progress.ValueText class="absolute text-sm font-medium tabular-nums text-ink" />
			{/if}
		</div>
		{#if label}
			<Progress.Label class="text-sm font-medium text-ink">{label}</Progress.Label>
		{/if}
	</div>
</Progress.Root>
