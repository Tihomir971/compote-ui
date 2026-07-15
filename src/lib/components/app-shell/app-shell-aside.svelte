<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<aside
	class={cn(
		'col-start-3 row-start-2 flex w-72 flex-col overflow-hidden border-l border-border bg-surface-1',
		className
	)}
	{...rest}
>
	{@render children?.()}
</aside>
