import {
	createListCollection as arkCreateListCollection,
	createTreeCollection as arkCreateTreeCollection
} from '@ark-ui/svelte/collection';
import type { ListCollection, TreeCollection } from '@ark-ui/svelte/collection';

export interface ListItem<T = number | string> {
	value: T;
	label: string;
	disabled?: boolean;
	group?: string;
}

export interface TreeItem {
	value: number | string;
	label: string;
	disabled?: boolean;
	children?: TreeItem[];
}

export function createListCollection<T extends ListItem>(items: T[]): ListCollection<T> {
	return arkCreateListCollection({
		items,
		itemToValue: (item) => item.value.toString(),
		itemToString: (item) => item.label,
		isItemDisabled: (item) => item.disabled === true
	});
}

export function createTreeCollection<T extends TreeItem>(items: T[]): TreeCollection<T> {
	return arkCreateTreeCollection<T>({
		nodeToValue: (node) => node.value.toString(),
		nodeToString: (node) => node.label,
		nodeToChildren: (node) => (node.children ?? []) as T[],
		rootNode: { value: 'ROOT', label: '', children: items } as unknown as T
	});
}
