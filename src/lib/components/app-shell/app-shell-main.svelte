<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<main class={cn('col-start-2 row-start-2 min-w-0 overflow-y-auto p-6', className)} {...rest}>
	{@render children?.()}
</main>
