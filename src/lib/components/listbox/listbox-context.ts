import { createContext } from 'svelte';
import type { ListCollection } from '@ark-ui/svelte/collection';
import type { ListItem } from '$lib/utils/collections';

export const [getListboxContext, setListboxContext] = createContext<{
	get collection(): ListCollection<ListItem>;
	filter: (text: string) => void;
}>();
