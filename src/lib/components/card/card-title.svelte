<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h3 class={cn('text-lg font-semibold', className)} {...rest}>
	{@render children?.()}
</h3>
