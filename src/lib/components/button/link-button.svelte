<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import { button, type ButtonVariant, type ButtonSize } from './button.variants';

	type Props = Omit<HTMLAnchorAttributes, 'class'> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
	};

	let { variant, size, class: className, children, ...rest }: Props = $props();
</script>

<a class={button({ variant, size, class: className })} {...rest}>
	{@render children?.()}
</a>
