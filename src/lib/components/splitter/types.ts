import type { SplitterRootBaseProps, SplitterPanelData } from '@ark-ui/svelte/splitter';
import type { Snippet } from 'svelte';

export interface SplitterPanelConfig extends SplitterPanelData {
	content: Snippet;
}

export interface SplitterProps extends Omit<SplitterRootBaseProps, 'panels'> {
	panels: SplitterPanelConfig[];
	class?: string;
}
