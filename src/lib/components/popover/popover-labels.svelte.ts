import { getContext, setContext, untrack } from 'svelte';

const key = Symbol('compote-popover-labels');

/**
 * Which labelling parts a popover currently renders. Zag checks for a title/description only
 * when its machine starts — before lazily mounted content exists — so it never sets
 * `aria-labelledby` / `aria-describedby` on the content. Title and Description register here
 * instead, and Content links them by the ids zag gives them.
 */
export class PopoverLabels {
	#titles = $state(0);
	#descriptions = $state(0);

	get hasTitle() {
		return this.#titles > 0;
	}

	get hasDescription() {
		return this.#descriptions > 0;
	}

	/** Registers a rendered title; returns the unregister function. */
	registerTitle(): () => void {
		untrack(() => this.#titles++);
		return () => untrack(() => this.#titles--);
	}

	/** Registers a rendered description; returns the unregister function. */
	registerDescription(): () => void {
		untrack(() => this.#descriptions++);
		return () => untrack(() => this.#descriptions--);
	}
}

export function setPopoverLabels(): PopoverLabels {
	return setContext(key, new PopoverLabels());
}

/** Undefined when the part is rendered outside compote's `Popover.Root`. */
export function getPopoverLabels(): PopoverLabels | undefined {
	return getContext<PopoverLabels | undefined>(key);
}
