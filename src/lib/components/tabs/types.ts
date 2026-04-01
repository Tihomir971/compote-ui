import type { TabsRootBaseProps } from '@ark-ui/svelte/tabs';
import type { Snippet } from 'svelte';

export interface TabsProps extends TabsRootBaseProps {
	/** Whether to show the animated indicator behind the active tab */
	indicator?: boolean;
	/** Snippet for rendering tab triggers inside the list */
	triggers?: Snippet;
}
