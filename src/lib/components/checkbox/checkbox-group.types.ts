import type { CheckboxGroupBaseProps } from '@ark-ui/svelte/checkbox';

export interface CheckboxGroupProps<T = string | number> extends Omit<
	CheckboxGroupBaseProps,
	'value'
> {
	label?: string;
	description?: string;
	items: { value: T; label: string }[];
	value: T[];
	orientation?: 'horizontal' | 'vertical';
}
