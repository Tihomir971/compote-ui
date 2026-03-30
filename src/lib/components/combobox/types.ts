import type { ComboboxRootBaseProps } from '@ark-ui/svelte/combobox';

export interface ComboboxItem<T = number | string> {
	value: T;
	label: string;
	disabled?: boolean;
}

export interface ComboboxProps<T extends ComboboxItem> extends Omit<
	ComboboxRootBaseProps<T>,
	'value' | 'collection'
> {
	value?: number | string | null | (number | string)[];
	items: T[];
	label?: string;
	placeholder?: string;
	readonly?: boolean;
	name?: string;
	multiple?: boolean;
	layout?: 'vertical' | 'horizontal';
}
