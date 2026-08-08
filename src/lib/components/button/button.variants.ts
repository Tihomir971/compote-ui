import { tv, type VariantProps } from 'tailwind-variants';

export const button = tv({
	base: 'inline-flex cursor-pointer items-center justify-center rounded bg-transparent text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0',
	variants: {
		variant: {
			default: 'bg-primary text-ink-inverse hover:bg-primary/90 active:bg-primary/80',
			outline: 'border text-ink hover:bg-surface-2',
			ghost: 'text-ink hover:bg-surface-2',
			destructive: 'bg-danger text-ink-inverse hover:bg-danger/90 active:bg-danger/80'
		},
		size: {
			sm: 'h-8 gap-1.5 px-2 [&_svg]:size-3.5',
			default: 'h-9 gap-2 px-3 [&_svg]:size-4',
			lg: 'h-10 gap-2.5 px-4 [&_svg]:size-5',
			icon: 'size-9 shrink-0 [&_svg]:size-6',
			'icon-xs': 'size-7 shrink-0 [&_svg]:size-4',
			'icon-sm': 'size-8 shrink-0 [&_svg]:size-5',
			'icon-lg': 'size-10 shrink-0 [&_svg]:size-7'
		}
	},
	defaultVariants: { variant: 'default', size: 'default' }
});

export type ButtonVariant = VariantProps<typeof button>['variant'];
export type ButtonSize = VariantProps<typeof button>['size'];
