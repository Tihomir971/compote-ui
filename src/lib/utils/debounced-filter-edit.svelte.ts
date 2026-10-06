/**
 * Debounced edits to table column filters. Each edit remembers the filter value it was made
 * against (its base). When that filter changes from outside before the edit commits (the app
 * calling setFilterValue / setColumnFilters / resetColumnFilters), the edit is stale: it is
 * no longer shown, and its timer does not commit it — so an external reset inside the
 * debounce window sticks instead of being overwritten by the pending edit.
 */
type Pending<T> = { value: T; base: unknown };

export class DebouncedFilterEdits<T> {
	// Raw, not deep: `base` must stay the exact filter value it is compared against — a deep
	// $state would proxy an array base (a range) and `Object.is` would never match it again.
	#pending = $state.raw<Record<string, Pending<T>>>({});
	// Timer handles are bookkeeping, never rendered — a reactive map would only add overhead.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	#timers = new Map<string, ReturnType<typeof setTimeout>>();
	#delay: number;

	constructor(delay = 300) {
		this.#delay = delay;
	}

	/** The pending edit for `id`, or undefined when there is none or it went stale. */
	get(id: string, current: unknown): T | undefined {
		const pending = this.#pending[id];
		return pending && Object.is(pending.base, current) ? pending.value : undefined;
	}

	/**
	 * Records an edit against the filter's `current` value: `update` receives the live
	 * pending edit (undefined when there is none or it went stale) and returns the new one.
	 * After the delay, `commit` runs with it — unless `read()` shows the filter changed.
	 */
	edit(
		id: string,
		current: unknown,
		update: (pending: T | undefined) => T,
		read: () => unknown,
		commit: (value: T) => void
	): void {
		this.#pending = {
			...this.#pending,
			[id]: { value: update(this.get(id, current)), base: current }
		};
		clearTimeout(this.#timers.get(id));
		this.#timers.set(
			id,
			setTimeout(() => {
				this.#timers.delete(id);
				const pending = this.#pending[id];
				this.#remove(id);
				if (pending && Object.is(read(), pending.base)) commit(pending.value);
			}, this.#delay)
		);
	}

	/** Drops the pending edit for `id` without committing it. */
	cancel(id: string): void {
		clearTimeout(this.#timers.get(id));
		this.#timers.delete(id);
		this.#remove(id);
	}

	/** Drops every pending edit without committing. */
	cancelAll(): void {
		for (const timer of this.#timers.values()) clearTimeout(timer);
		this.#timers.clear();
		this.#pending = {};
	}

	#remove(id: string): void {
		if (!(id in this.#pending)) return;
		// eslint-disable-next-line @typescript-eslint/no-unused-vars -- dropped from the record
		const { [id]: _removed, ...rest } = this.#pending;
		this.#pending = rest;
	}
}
