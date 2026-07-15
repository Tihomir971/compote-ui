<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<footer
	class={cn(
		'col-span-full row-start-3 flex items-center border-t border-border bg-surface-1 px-4',
		className
	)}
	{...rest}
>
	{@render children?.()}
</footer>
