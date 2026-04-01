<script lang="ts">
	import { Menu } from '@ark-ui/svelte/menu';
	import type { MenuRootBaseProps } from '@ark-ui/svelte/menu';

	type Props = MenuRootBaseProps;

	const { children, ...restProps }: Props = $props();
</script>

<Menu.Root {...restProps}>
	{@render children?.()}
</Menu.Root>
