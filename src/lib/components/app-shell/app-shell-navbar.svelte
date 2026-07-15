<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<nav
	class={cn(
		'col-start-1 row-start-2 flex w-60 flex-col overflow-hidden border-r border-border bg-surface-1',
		className
	)}
	{...rest}
>
	{@render children?.()}
</nav>
