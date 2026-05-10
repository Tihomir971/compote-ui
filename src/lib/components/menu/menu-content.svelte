<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import { Portal } from '@ark-ui/svelte/portal';
	import type { MenuContentBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuContentBaseProps & {
		class?: string;
		children: Snippet;
	};

	const { class: className, children, ...restProps }: Props = $props();
</script>

<Portal>
	<Menu.Positioner>
		<Menu.Content
			{...restProps}
			class={cn(
				'z-50 min-w-32 overflow-hidden rounded-md border bg-surface-1 p-1 text-ink shadow-md outline-none',
				className
			)}
		>
			{@render children()}
		</Menu.Content>
	</Menu.Positioner>
</Portal>
