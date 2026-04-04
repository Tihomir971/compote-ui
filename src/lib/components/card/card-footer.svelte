<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex items-center p-6 pt-0', className)} {...rest}>
	{@render children?.()}
</div>
