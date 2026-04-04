<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	let { class: className, children, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn('flex flex-col gap-1.5 p-6', className)} {...rest}>
	{@render children?.()}
</div>
