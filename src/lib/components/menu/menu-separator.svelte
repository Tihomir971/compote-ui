<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuSeparatorBaseProps } from '@ark-ui/svelte/menu';
	import { cn } from 'tailwind-variants';

	type Props = MenuSeparatorBaseProps & { class?: string };

	const { class: className, ...restProps }: Props = $props();
</script>

<Menu.Separator {...restProps} class={cn('-mx-1 my-1 h-px bg-surface-3', className)} />
