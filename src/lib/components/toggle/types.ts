import type { ToggleRootProps } from '@ark-ui/svelte/toggle';
import type { ClassValue } from 'svelte/elements';
import type { ToggleSize } from './toggle.variants';

export interface ToggleProps extends ToggleRootProps {
	class?: ClassValue | null;
	size?: ToggleSize;
}

export type { ToggleSize };
