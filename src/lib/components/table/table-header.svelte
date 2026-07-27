<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = HTMLAttributes<HTMLTableSectionElement> & {
		sticky?: boolean;
	};

	let { sticky = true, class: className, children, ...rest }: Props = $props();
</script>

<!-- Sticky by default: with no scrolling ancestor it simply behaves as static,
     so the same header works inside a scroll container and inside a dialog. -->
<thead class={cn('bg-surface-2 text-ink-dim', sticky && 'sticky top-0 z-20', className)} {...rest}>
	{@render children?.()}
</thead>
