<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<header
	class={cn(
		'col-span-full row-start-1 flex items-center border-b border-border bg-surface-1 px-4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</header>
