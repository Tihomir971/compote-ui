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

<div class={cn('mt-auto flex flex-row items-center justify-end gap-2 border-t border-border p-4', className)}>
	{@render children()}
</div>
