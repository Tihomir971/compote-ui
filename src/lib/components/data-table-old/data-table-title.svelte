<script lang="ts">
	import { cn, type ClassValue } from 'tailwind-variants';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type Props = Omit<HTMLAttributes<HTMLHeadingElement>, 'class'> & {
		class?: ClassValue;
		children?: Snippet;
	};

	let { class: className, children, ...rest }: Props = $props();
</script>

<h2 class={cn('text-lg font-semibold text-ink', className)} {...rest}>
	{@render children?.()}
</h2>
