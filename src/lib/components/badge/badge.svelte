<script lang="ts">
	import type { Snippet } from 'svelte';
	import { badge } from './badge.variants';
	import type { BadgeProps } from './types';

	type Props = BadgeProps & {
		children?: Snippet;
	};

	let { variant, color, icon, class: className, children, ...rest }: Props = $props();
</script>

<span class={badge({ variant, color, class: className })} {...rest}>
	{@render icon?.()}
	{@render children?.()}
</span>
