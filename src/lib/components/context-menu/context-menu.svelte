<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';

	type Props = {
		onSelect?: (details: { value: string }) => void;
		children: Snippet;
	};

	const { onSelect, children }: Props = $props();
</script>

<Menu.Root onSelect={onSelect}>
	{@render children()}
</Menu.Root>
