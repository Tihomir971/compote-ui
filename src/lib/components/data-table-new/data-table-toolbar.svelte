<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		class?: ClassValue;
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<div class={cn('mb-4 flex flex-wrap items-center justify-between gap-3', className)} {...rest}>
	{@render children?.()}
</div>
