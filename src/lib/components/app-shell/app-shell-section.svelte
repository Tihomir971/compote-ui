<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = HTMLAttributes<HTMLDivElement> & {
		grow?: boolean;
	};

	let { grow = false, class: className, children, ...rest }: Props = $props();
</script>

<div
	class={cn(grow ? 'min-h-0 flex-1 overflow-x-hidden overflow-y-auto' : 'shrink-0', className)}
	{...rest}
>
	{@render children?.()}
</div>
