<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		class?: ClassValue;
		children: Snippet;
	}

	let { class: className, children }: Props = $props();
</script>

<div class={className ?? 'mt-4 flex justify-end gap-3'}>
	{@render children()}
</div>
