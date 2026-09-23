<script lang="ts">
	import { Menu, useMenuContext } from '@ark-ui/svelte/menu';
	import { Portal } from '@ark-ui/svelte/portal';
	import type { MenuContentBaseProps } from '@ark-ui/svelte/menu';
	import type { Snippet } from 'svelte';
	import { cn } from 'tailwind-variants';

	type Props = MenuContentBaseProps & {
		class?: string;
		children: Snippet;
	};

	const { class: className, children, ...restProps }: Props = $props();

	const menu = useMenuContext();
	const open = $derived(menu().open);

	// Workaround for context menus opening at (0,0) the first time: zag skips
	// `trackPositioning` for context triggers, so `currentPlacement` is first set in
	// the popper's onComplete — after it wrote --x/--y. That changes the positioner
	// style, and Svelte rewrites the whole `style` attribute, wiping --x/--y.
	// Re-positioning once that settles makes the coordinates stick.
	$effect(() => {
		if (!open) return;
		let inner = 0;
		const outer = requestAnimationFrame(() => {
			inner = requestAnimationFrame(() => menu().reposition());
		});
		return () => {
			cancelAnimationFrame(outer);
			cancelAnimationFrame(inner);
		};
	});
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
