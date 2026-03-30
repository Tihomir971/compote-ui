import type { UseTreeViewProps } from '@ark-ui/svelte/tree-view';

export interface TreeNode {
	value: number | string;
	label: string;
	disabled?: boolean;
	children?: TreeNode[];
}

// UseTreeViewProps<T> already includes: selectionMode, selectedValue, expandedValue,
// checkedValue, onSelectionChange, onExpandedChange, onCheckedChange, and more.
// We omit 'collection' since we expose 'items' instead and build it internally.
export interface TreeViewProps<T extends TreeNode> extends Omit<UseTreeViewProps<T>, 'collection'> {
	items?: T[];
	label?: string;
	contextNode?: string | null;
}
