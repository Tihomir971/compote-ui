<script lang="ts">
	import { cn } from 'tailwind-variants';
	import type { FilterableColumn } from '../column-filter-editing.svelte';

	type Props = {
		column: FilterableColumn;
	};

	let { column }: Props = $props();

	const value = $derived(column.getFilterValue() as boolean | undefined);
</script>

<div class="flex overflow-hidden rounded border border-border text-xs">
	<button
		type="button"
		onclick={() => column.setFilterValue(undefined)}
		class={cn(
			'flex-1 px-2 py-1',
			value === undefined ? 'bg-surface-3 font-medium text-ink' : 'text-ink-dim hover:bg-surface-2'
		)}
	>
		All
	</button>
	<button
		type="button"
		onclick={() => column.setFilterValue(value === true ? undefined : true)}
		class={cn(
			'flex-1 border-x border-border px-2 py-1',
			value === true ? 'bg-surface-3 font-medium text-ink' : 'text-ink-dim hover:bg-surface-2'
		)}
	>
		Yes
	</button>
	<button
		type="button"
		onclick={() => column.setFilterValue(value === false ? undefined : false)}
		class={cn(
			'flex-1 px-2 py-1',
			value === false ? 'bg-surface-3 font-medium text-ink' : 'text-ink-dim hover:bg-surface-2'
		)}
	>
		No
	</button>
</div>
