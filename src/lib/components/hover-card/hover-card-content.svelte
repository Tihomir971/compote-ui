<script lang="ts">
	import { HoverCard } from '@ark-ui/svelte/hover-card';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import type { ClassValue } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props {
		class?: ClassValue;
		children: Snippet;
		showArrow?: boolean;
	}

	let { class: className, children, showArrow = true }: Props = $props();
</script>

<Portal>
	<HoverCard.Positioner>
		<HoverCard.Content
			class={cn(
				'z-50 w-72 rounded-md border border-border bg-surface-1 p-4 shadow-md outline-none [--arrow-background:var(--compote-surface-1)] [--arrow-size:10px]',
				className
			)}
		>
			{#if showArrow}
				<HoverCard.Arrow>
					<HoverCard.ArrowTip class="border-t border-l border-border" />
				</HoverCard.Arrow>
			{/if}
			{@render children()}
		</HoverCard.Content>
	</HoverCard.Positioner>
</Portal>

<style>
	:global([data-scope='hover-card'][data-part='content']) {
		transform-origin: var(--transform-origin);
	}

	:global([data-scope='hover-card'][data-part='content'][data-state='open']) {
		animation: hover-card-in 150ms ease-out;
	}

	:global([data-scope='hover-card'][data-part='content'][data-state='closed']) {
		animation: hover-card-out 100ms ease-in;
	}

	@keyframes hover-card-in {
		from {
			opacity: 0;
			transform: scale(0.95);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	@keyframes hover-card-out {
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
