<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';

	type Props = {
		class?: string;
		children: Snippet;
	};

	const { class: className, children }: Props = $props();
</script>

<Menu.ContextTrigger>
	{#snippet asChild(props)}
		<div {...props()} class={className}>
			{@render children()}
		</div>
	{/snippet}
</Menu.ContextTrigger>
