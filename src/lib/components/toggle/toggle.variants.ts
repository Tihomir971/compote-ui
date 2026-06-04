import { tv, type VariantProps } from 'tailwind-variants';

export const toggle = tv({
	base: 'inline-flex cursor-pointer items-center justify-center rounded-md font-medium text-ink-dim transition-colors select-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 [&_svg]:shrink-0',
	variants: {
		variant: {
			ghost:
				'hover:bg-surface-2 hover:text-ink data-pressed:bg-surface-2 data-pressed:text-ink data-pressed:shadow-sm data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm',
			outline:
				'border border-border hover:bg-surface-2 hover:text-ink data-pressed:bg-surface-2 data-pressed:text-ink data-pressed:shadow-sm data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm'
		},
		size: {
			sm: 'h-7 min-w-7 gap-1 px-1.5 text-xs [&_svg]:size-3.5',
			md: 'h-8 min-w-8 gap-1.5 px-2 text-sm [&_svg]:size-4',
			lg: 'h-9 min-w-9 gap-2 px-2.5 text-sm [&_svg]:size-5'
		},
		icon: {
			true: ''
		}
	},
	compoundVariants: [
		{ size: 'sm', icon: true, class: 'w-7 px-0 [&_svg]:size-5' },
		{ size: 'md', icon: true, class: 'w-8 px-0 [&_svg]:size-6' },
		{ size: 'lg', icon: true, class: 'w-9 px-0 [&_svg]:size-7' }
	],
	defaultVariants: { size: 'md', variant: 'ghost' }
});

export type ToggleSize = NonNullable<VariantProps<typeof toggle>['size']>;
export type ToggleVariant = NonNullable<VariantProps<typeof toggle>['variant']>;
