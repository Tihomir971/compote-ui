<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = HTMLAttributes<HTMLTableSectionElement> & {
		sticky?: boolean;
	};

	let { sticky = true, class: className, children, ...rest }: Props = $props();
</script>

<!-- Footer cells are plain Table.Cell; the border flip (bottom -> top), the
     surface and the weight are applied here so Cell stays context-free. -->
<tfoot
	class={cn(
		'bg-surface-2 text-ink-dim',
		'[&_td]:border-t [&_td]:border-b-0 [&_td]:border-surface-3 [&_td]:bg-surface-2 [&_td]:font-medium',
		sticky && 'sticky bottom-0 z-20',
		className
	)}
	{...rest}
>
	{@render children?.()}
</tfoot>
