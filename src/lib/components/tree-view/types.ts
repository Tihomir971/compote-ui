import type { UseTreeViewProps } from '@ark-ui/svelte/tree-view';
import type { TreeItem } from '$lib/utils/collections';

// UseTreeViewProps<T> already includes: selectionMode, selectedValue, expandedValue,
// checkedValue, onSelectionChange, onExpandedChange, onCheckedChange, and more.
// We omit 'collection' since we expose 'items' instead and build it internally.
export interface TreeViewProps<T extends TreeItem> extends Omit<UseTreeViewProps<T>, 'collection'> {
	items?: T[];
	label?: string;
	contextNode?: string | null;
}
