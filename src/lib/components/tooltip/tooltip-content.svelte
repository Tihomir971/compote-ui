<script lang="ts">
	import { Portal } from '@ark-ui/svelte/portal';
	import { Tooltip } from '@ark-ui/svelte/tooltip';
	import type { TooltipContentBaseProps } from '@ark-ui/svelte/tooltip';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = TooltipContentBaseProps & {
		class?: string;
		children: Snippet;
		showArrow?: boolean;
	};

	const { class: className, children, showArrow = true, ...restProps }: Props = $props();
</script>

<Portal>
	<Tooltip.Positioner>
		<Tooltip.Content
			{...restProps}
			class={cn(
				'z-50 max-w-80 rounded-md border bg-well px-2.5 py-1.5 text-xs font-medium text-ink shadow-md outline-none [--arrow-background:var(--compote-well)] [--arrow-size:10px]',
				className
			)}
		>
			{#if showArrow}
				<Tooltip.Arrow>
					<Tooltip.ArrowTip class="border-t border-l" />
				</Tooltip.Arrow>
			{/if}
			{@render children()}
		</Tooltip.Content>
	</Tooltip.Positioner>
</Portal>

<style>
	:global([data-scope='tooltip'][data-part='content'][data-state='open']) {
		animation: tooltip-scale-fade-in 0.15s ease-out;
		transform-origin: var(--transform-origin);
	}

	:global([data-scope='tooltip'][data-part='content'][data-state='closed']) {
		animation: tooltip-scale-fade-out 0.1s ease-in;
		transform-origin: var(--transform-origin);
	}

	@keyframes tooltip-scale-fade-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes tooltip-scale-fade-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.96);
		}
	}
</style>
