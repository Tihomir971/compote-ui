<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = HTMLAttributes<HTMLTableRowElement> & {
		selected?: boolean;
	};

	let { selected = false, class: className, children, ...rest }: Props = $props();
</script>

<!-- `group/row` lets cells drop their bottom border on the last row. The hover
     tint is invisible on header/footer rows because those cells set an opaque
     bg-surface-2 of their own. -->
<tr class={cn('group/row h-9 hover:bg-well/60', selected && 'bg-well/60', className)} {...rest}>
	{@render children?.()}
</tr>
