<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';

	type Props = Omit<HTMLAttributes<HTMLHeadingElement>, 'class'> & {
		class?: ClassValue;
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<h2 class={cn('text-lg font-semibold text-ink', className)} {...rest}>
	{@render children?.()}
</h2>
