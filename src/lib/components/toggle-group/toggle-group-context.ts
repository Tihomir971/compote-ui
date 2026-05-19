import { createContext } from 'svelte';
import type { ToggleSize } from '../toggle/toggle.variants';

export type ToggleGroupVariant = 'outline' | 'ghost';

export const [getToggleGroupContext, setToggleGroupContext] = createContext<{
	get size(): ToggleSize;
	get variant(): ToggleGroupVariant;
	get icon(): boolean;
}>();
