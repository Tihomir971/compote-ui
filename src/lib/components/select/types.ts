import type { SelectRootBaseProps } from '@ark-ui/svelte/select';
import type { ListItem } from '$lib/utils/collections';

export interface SelectProps<T extends ListItem> extends Omit<
	SelectRootBaseProps<T>,
	'value' | 'collection'
> {
	value?: number | string | null;
	items: T[];
	label?: string;
	placeholder?: string;
	layout?: 'vertical' | 'horizontal';
}
