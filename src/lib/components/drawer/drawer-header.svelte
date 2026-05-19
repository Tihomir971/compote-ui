<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import { cn } from 'tailwind-variants';

	interface Props {
		class?: ClassValue;
		children: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<div class={cn('flex flex-col p-4 pr-11', className)}>
	{@render children()}
</div>
