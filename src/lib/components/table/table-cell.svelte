<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLTdAttributes = $props();
</script>

<td
	class={cn(
		'h-9 border-b border-surface-2 px-3 py-0 align-middle group-last/row:border-b-0',
		className
	)}
	{...rest}
>
	{@render children?.()}
</td>
