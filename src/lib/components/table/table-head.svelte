<script lang="ts">
	import type { HTMLThAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { scope = 'col', class: className, children, ...rest }: HTMLThAttributes = $props();
</script>

<th
	{scope}
	class={cn(
		'h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle leading-5 font-medium',
		className
	)}
	{...rest}
>
	{@render children?.()}
</th>
