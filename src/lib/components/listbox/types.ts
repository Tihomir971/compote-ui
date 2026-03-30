import type { ListboxRootBaseProps } from '@ark-ui/svelte/listbox';

export interface ListboxItem<T = number | string> {
	value: T;
	label: string;
	disabled?: boolean;
	group?: string;
}

export interface ListboxProps<T extends number | string = number | string>
	extends Omit<ListboxRootBaseProps<ListboxItem<T>>, 'collection' | 'value'> {
	items: ListboxItem<T>[];
	value?: T[];
	label?: string;
	name?: string;
	filterable?: boolean;
	filterPlaceholder?: string;
	class?: string;
}
