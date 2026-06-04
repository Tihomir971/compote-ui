<script lang="ts">
	import { Popover } from '@ark-ui/svelte/popover';
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
	<Popover.Positioner>
		<Popover.Content
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
