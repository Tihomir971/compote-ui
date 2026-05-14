<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn, type ClassValue } from 'tailwind-variants';

	type Props = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
		class?: ClassValue;
		children?: Snippet;
		center?: Snippet;
		right?: Snippet;
	};

	let { class: className, children, center, right, ...rest }: Props = $props();
</script>

<div
	class={cn('mb-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3', className)}
	{...rest}
>
	<div class="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-3 justify-self-start">
		{@render children?.()}
	</div>

    {#if center}
    	<div
    		class="col-start-2 row-start-1 flex min-w-0 flex-wrap items-center justify-center gap-3 justify-self-center"
    	>
    		{@render center()}
    	</div>
    {/if}

    {#if right}
    	<div
    		class="col-start-3 row-start-1 flex min-w-0 flex-wrap items-center justify-end gap-3 justify-self-end"
    	>
    		{@render right()}
    	</div>
    {/if}

</div>
