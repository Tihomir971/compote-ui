import type { ToggleRootProps } from '@ark-ui/svelte/toggle';
import type { ClassValue } from 'svelte/elements';
import type { ToggleSize, ToggleVariant } from './toggle.variants';

export interface ToggleProps extends ToggleRootProps {
	class?: ClassValue | null;
	size?: ToggleSize;
	variant?: ToggleVariant;
	icon?: boolean;
}

export type { ToggleSize, ToggleVariant };
