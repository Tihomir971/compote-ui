import { createContext } from 'svelte';
import type { ToggleSize } from '../toggle/toggle.variants';

export const [getToggleGroupContext, setToggleGroupContext] = createContext<{
	get size(): ToggleSize;
}>();
