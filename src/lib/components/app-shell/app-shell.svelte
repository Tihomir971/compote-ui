<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn(
		'relative grid h-dvh grid-cols-[auto_1fr_auto] grid-rows-[auto_1fr_auto] bg-surface-document text-ink',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>
