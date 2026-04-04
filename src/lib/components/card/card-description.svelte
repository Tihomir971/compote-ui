<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={cn('text-sm text-ink-dim', className)} {...rest}>
	{@render children?.()}
</p>
