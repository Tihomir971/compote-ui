<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLTableAttributes = $props();
</script>

<!-- border-separate (not border-collapse) keeps cell borders painted under a
     sticky header, matching how DataTable renders its own table. -->
<table
	class={cn('w-full border-separate border-spacing-0 text-left text-sm text-ink', className)}
	{...rest}
>
	{@render children?.()}
</table>
