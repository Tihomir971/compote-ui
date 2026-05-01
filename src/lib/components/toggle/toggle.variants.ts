import { tv, type VariantProps } from 'tailwind-variants';

export const toggle = tv({
	base: 'inline-flex cursor-pointer items-center justify-center rounded-md font-medium text-ink-dim transition-colors select-none hover:bg-surface-2 hover:text-ink focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-surface-2 data-pressed:text-ink data-pressed:shadow-sm data-[state=on]:bg-surface-2 data-[state=on]:text-ink data-[state=on]:shadow-sm [&_svg]:shrink-0',
	variants: {
		size: {
			sm: 'h-7 min-w-7 gap-1 px-1.5 text-xs [&_svg]:size-3.5',
			md: 'h-8 min-w-8 gap-1.5 px-2 text-sm [&_svg]:size-4',
			lg: 'h-10 min-w-10 gap-2 px-2.5 text-sm [&_svg]:size-5'
		}
	},
	defaultVariants: { size: 'md' }
});

export type ToggleSize = NonNullable<VariantProps<typeof toggle>['size']>;
