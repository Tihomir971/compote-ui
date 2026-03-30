<script lang="ts">
	import { Splitter } from '@ark-ui/svelte/splitter';
	import { cn } from 'tailwind-variants';
	import type { SplitterProps } from './types';

	let {
		panels,
		class: className,
		orientation = 'horizontal',
		...restProps
	}: SplitterProps = $props();

	const isHorizontal = $derived(orientation === 'horizontal');
	const arkPanels = $derived(panels.map(({ content, ...rest }) => rest));
</script>

<Splitter.Root
	{orientation}
	panels={arkPanels}
	{...restProps}
	class={cn('flex h-full w-full', !isHorizontal && 'flex-col', className)}
>
	{#each panels as panelConfig, i (panelConfig.id)}
		<Splitter.Panel
			id={panelConfig.id}
			class={cn('overflow-auto p-2', isHorizontal ? 'min-w-0' : 'min-h-0')}
		>
			{@render panelConfig.content()}
		</Splitter.Panel>

		{#if i < panels.length - 1}
			<Splitter.ResizeTrigger
				id={`${panelConfig.id}:${panels[i + 1].id}`}
				aria-label={`Resize ${panelConfig.id} and ${panels[i + 1].id}`}
				class={cn(
					'group relative flex shrink-0 items-center justify-center border-none bg-transparent p-0 outline-none',
					isHorizontal ? 'w-1.5 cursor-col-resize' : 'h-1.5 cursor-row-resize'
				)}
			>
				<!-- Divider line -->
				<div
					class={cn(
						'absolute bg-surface-3 transition-colors group-focus-within:bg-primary group-data-dragging:bg-primary',
						isHorizontal
							? 'inset-y-0 left-1/2 w-px -translate-x-1/2'
							: 'inset-x-0 top-1/2 h-px -translate-y-1/2'
					)}
				></div>
				<!-- Handle pill -->
				<div
					class={cn(
						'relative z-10 rounded-full bg-surface-3 shadow-sm transition-colors group-data-dragging:bg-primary',
						isHorizontal ? 'h-6 w-1' : 'h-1 w-6'
					)}
				></div>
			</Splitter.ResizeTrigger>
		{/if}
	{/each}
</Splitter.Root>
