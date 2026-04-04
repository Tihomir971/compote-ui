<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 class={cn('text-base font-semibold leading-none', className)} {...rest}>
	{@render children?.()}
</h3>
