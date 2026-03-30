<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const button = tv({
		base: 'focus-visible:outline-ring inline-flex cursor-pointer items-center justify-center rounded bg-transparent font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				solid: 'text-primary-foreground bg-primary hover:bg-primary/90 active:bg-primary/80',
				outline: 'border-border text-foreground hover:bg-muted border',
				ghost: 'text-foreground hover:bg-muted'
			},
			size: {
				sm: 'h-8 gap-1.5 px-2 text-sm',
				md: 'h-9 gap-2 px-3 text-base',
				lg: 'h-10 gap-2.5 px-4 text-lg'
			}
		},
		defaultVariants: { variant: 'solid', size: 'md' }
	});

	type Props = Omit<HTMLButtonAttributes, 'class'> & {
		variant?: 'solid' | 'outline' | 'ghost';
		size?: 'sm' | 'md' | 'lg';
		class?: string;
	};

	let { variant, size, class: className, children, ...rest }: Props = $props();
</script>

<button class={button({ variant, size, class: className })} {...rest}>
	{@render children?.()}
</button>
