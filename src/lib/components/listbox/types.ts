import type { ListboxRootBaseProps } from '@ark-ui/svelte/listbox';
import type { ListItem } from '$lib/utils/collections';

export interface ListboxProps<T extends number | string = number | string> extends Omit<
	ListboxRootBaseProps<ListItem<T>>,
	'collection' | 'value'
> {
	items: ListItem<T>[];
	value?: T[];
	label?: string;
	name?: string;
	filterable?: boolean;
	filterPlaceholder?: string;
	class?: string;
}
