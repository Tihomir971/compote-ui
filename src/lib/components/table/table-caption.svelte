<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	// Svelte types `<caption>` against HTMLElement, not HTMLTableCaptionElement.
	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<caption class={cn('px-3 py-2 text-left text-sm text-ink-dim', className)} {...rest}>
	{@render children?.()}
</caption>
