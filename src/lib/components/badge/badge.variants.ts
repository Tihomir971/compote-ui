import { tv, type VariantProps } from 'tailwind-variants';

export const badge = tv({
	base: 'inline-flex w-fit items-center gap-1 rounded px-2 py-0.5 text-xs font-medium [&_svg]:size-3 [&_svg]:shrink-0',
	variants: {
		variant: {
			solid: '',
			subtle: '',
			outline: 'border bg-transparent'
		},
		color: {
			neutral: '',
			primary: '',
			danger: '',
			warning: '',
			success: '',
			info: ''
		}
	},
	compoundVariants: [
		{ variant: 'solid', color: 'neutral', class: 'bg-surface-3 text-ink' },
		{ variant: 'solid', color: 'primary', class: 'bg-primary text-ink-inverse' },
		{ variant: 'solid', color: 'danger', class: 'bg-danger text-ink-inverse' },
		{ variant: 'solid', color: 'warning', class: 'bg-warning text-ink-inverse' },
		{ variant: 'solid', color: 'success', class: 'bg-success text-ink-inverse' },
		{ variant: 'solid', color: 'info', class: 'bg-info text-ink-inverse' },

		{ variant: 'subtle', color: 'neutral', class: 'bg-surface-2 text-ink-dim' },
		{ variant: 'subtle', color: 'primary', class: 'bg-primary/10 text-primary' },
		{ variant: 'subtle', color: 'danger', class: 'bg-danger/10 text-danger' },
		{ variant: 'subtle', color: 'warning', class: 'bg-warning/10 text-warning' },
		{ variant: 'subtle', color: 'success', class: 'bg-success/10 text-success' },
		{ variant: 'subtle', color: 'info', class: 'bg-info/10 text-info' },

		{ variant: 'outline', color: 'neutral', class: 'border-border text-ink-dim' },
		{ variant: 'outline', color: 'primary', class: 'border-primary text-primary' },
		{ variant: 'outline', color: 'danger', class: 'border-danger text-danger' },
		{ variant: 'outline', color: 'warning', class: 'border-warning text-warning' },
		{ variant: 'outline', color: 'success', class: 'border-success text-success' },
		{ variant: 'outline', color: 'info', class: 'border-info text-info' }
	],
	defaultVariants: { variant: 'subtle', color: 'neutral' }
});

export type BadgeVariant = NonNullable<VariantProps<typeof badge>['variant']>;
export type BadgeColor = NonNullable<VariantProps<typeof badge>['color']>;
