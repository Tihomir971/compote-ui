<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { button, type ButtonVariant, type ButtonSize } from './button.variants';

	type Props = Omit<HTMLButtonAttributes, 'class'> & {
		variant?: ButtonVariant;
		size?: ButtonSize;
		class?: string;
	};

	let { variant, size, class: className, children, ...rest }: Props = $props();
</script>

<button class={button({ variant, size, class: className })} {...rest}>
	{@render children?.()}
</button>
