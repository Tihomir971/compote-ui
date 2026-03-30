<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = {
		class?: string;
		children: Snippet;
	};

	const { class: className, children }: Props = $props();
</script>

<Menu.Positioner>
	<Menu.Content
		class={cn(
			'bg-surface-1 text-ink z-50 min-w-32 overflow-hidden rounded-md border p-1 shadow-md outline-none',
			className
		)}
	>
		{@render children()}
	</Menu.Content>
</Menu.Positioner>
