import type { ComboboxRootBaseProps } from '@ark-ui/svelte/combobox';
import type { ListItem } from '$lib/utils/collections';

export interface ComboboxProps<T extends ListItem> extends Omit<
	ComboboxRootBaseProps<T>,
	'value' | 'collection'
> {
	value?: number | string | null | (number | string)[];
	items: T[];
	label?: string;
	placeholder?: string;
	name?: string;
	multiple?: boolean;
	layout?: 'vertical' | 'horizontal';
	loading?: boolean;
}
