<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	type Props = HTMLAttributes<HTMLElement> & {
		expanded?: boolean;
	};

	let { expanded = $bindable(false), class: className, children, ...rest }: Props = $props();
</script>

<nav
	data-expanded={expanded || undefined}
	class={cn(
		'group absolute inset-y-0 left-0 z-20 flex w-16 flex-col overflow-hidden',
		'border-r border-border bg-surface-1 transition-[width] duration-200',
		'hover:w-60 focus-within:w-60 data-expanded:w-60',
		className
	)}
	{...rest}
>
	{@render children?.()}
</nav>
