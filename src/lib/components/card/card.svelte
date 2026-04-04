<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('rounded-xl border border-border bg-surface-1 text-ink', className)} {...rest}>
	{@render children?.()}
</div>
