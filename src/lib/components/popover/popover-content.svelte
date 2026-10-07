<script lang="ts">
	import { Popover, usePopoverContext } from '@ark-ui/svelte/popover';
	import type { PopoverContentProps } from '@ark-ui/svelte/popover';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { getPopoverLabels } from './popover-labels.svelte';

	interface Props extends Omit<PopoverContentProps, 'class' | 'children'> {
		class?: ClassValue;
		children: Snippet;
		showArrow?: boolean;
	}

	let {
		class: className,
		children,
		showArrow = true,
		'aria-labelledby': ariaLabelledby,
		'aria-describedby': ariaDescribedby,
		...rest
	}: Props = $props();

	const popover = usePopoverContext();
	const labels = getPopoverLabels();

	// Explicit labelling wins; otherwise link the Title / Description rendered inside.
	const labelledby = $derived(
		ariaLabelledby ??
			(labels?.hasTitle && !rest['aria-label'] ? popover().getTitleProps().id : undefined)
	);
	const describedby = $derived(
		ariaDescribedby ?? (labels?.hasDescription ? popover().getDescriptionProps().id : undefined)
	);
</script>

<Portal>
	<Popover.Positioner>
		<Popover.Content
			{...rest}
			aria-labelledby={labelledby}
			aria-describedby={describedby}
			class={cn(
				'z-50 w-72 rounded-md border bg-surface-document p-4 shadow-md outline-none [--arrow-background:var(--compote-surface-1)] [--arrow-size:10px]',
				'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
				'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
				className
			)}
		>
			{#if showArrow}
				<Popover.Arrow>
					<Popover.ArrowTip class="border-t border-l border-border" />
				</Popover.Arrow>
			{/if}
			{@render children()}
		</Popover.Content>
	</Popover.Positioner>
</Portal>

<style>
	:global([data-scope='popover'][data-part='content']) {
		transform-origin: var(--transform-origin);
	}

	:global([data-scope='popover'][data-part='content'][data-state='open']) {
		animation: popover-in 150ms ease-out;
	}

	:global([data-scope='popover'][data-part='content'][data-state='closed']) {
		animation: popover-out 100ms ease-in;
	}

	@keyframes popover-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes popover-out {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.95);
		}
	}
</style>
