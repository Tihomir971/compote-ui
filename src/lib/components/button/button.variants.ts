import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
	base: 'focus-visible:outline-ring inline-flex cursor-pointer items-center justify-center rounded bg-transparent text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-white hover:bg-primary/90 active:bg-primary/80',
			outline: 'border text-ink hover:bg-surface-2',
			ghost: 'text-ink hover:bg-surface-2'
		},
		size: {
			sm: 'h-8 gap-1.5 px-2',
			default: 'h-9 gap-2 px-3',
			lg: 'h-10 gap-2.5 px-4',
			icon: 'size-9',
			'icon-sm': 'size-8',
			'icon-lg': 'size-10'
		}
	},
	defaultVariants: { variant: 'default', size: 'default' }
});

export type ButtonVariant = VariantProps<typeof button>['variant'];
export type ButtonSize = VariantProps<typeof button>['size'];
