<script lang="ts">
	import { Collapsible } from '@ark-ui/svelte/collapsible';
	import type { CollapsibleContentBaseProps } from '@ark-ui/svelte/collapsible';
	import { cn } from 'tailwind-variants';

	interface Props extends CollapsibleContentBaseProps {
		class?: string;
	}

	let { class: className, children, ...rest }: Props = $props();
</script>

<Collapsible.Content {...rest} class={cn('flex flex-col gap-2 overflow-hidden', className)}>
	{@render children?.()}
</Collapsible.Content>

<style>
	:global([data-scope='collapsible'][data-part='content'][data-state='open']) {
		animation:
			collapsible-expand-height 120ms ease-out,
			collapsible-fade-in 120ms ease-out;
	}

	:global(
		[data-scope='collapsible'][data-part='content'][data-state='open'][data-has-collapsed-size]
	) {
		animation-name: collapsible-expand-height;
	}

	:global([data-scope='collapsible'][data-part='content'][data-state='closed']) {
		animation:
			collapsible-collapse-height 120ms ease-out,
			collapsible-fade-out 120ms ease-out;
	}

	:global(
		[data-scope='collapsible'][data-part='content'][data-state='closed'][data-has-collapsed-size]
	) {
		animation-name: collapsible-collapse-height;
		box-shadow: inset 0 -12px 12px -12px rgba(0, 0, 0, 0.5);
	}

	@keyframes collapsible-expand-height {
		from {
			height: var(--collapsed-height, 0);
		}
		to {
			height: var(--height);
		}
	}

	@keyframes collapsible-collapse-height {
		from {
			height: var(--height);
		}
		to {
			height: var(--collapsed-height, 0);
		}
	}

	@keyframes collapsible-fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	@keyframes collapsible-fade-out {
		from {
			opacity: 1;
		}
		to {
			opacity: 0;
		}
	}
</style>
