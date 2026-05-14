<script lang="ts" generics="TFeatures extends TableFeatures, T extends RowData, TState = TableState<TFeatures>">
	import { FlexRender } from '@tanstack/svelte-table';
	import type { RowData, SvelteTable, TableFeatures, TableState } from '@tanstack/svelte-table';

	type Props = {
		table: SvelteTable<TFeatures, T, TState>;
	};

	let { table }: Props = $props();
</script>

<table class="w-full border-collapse text-sm">
	<thead>
		{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
			<tr>
				{#each headerGroup.headers as header (header.id)}
					<th class="border border-surface-3 bg-surface-2 px-3 py-2 text-left font-medium">
						{#if !header.isPlaceholder}
							<FlexRender {header} />
						{/if}
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each table.getRowModel().rows as row (row.id)}
			<tr class="hover:bg-well/40">
				{#each row.getAllCells() as cell (cell.id)}
					<td class="border border-surface-3 px-3 py-2">
						<FlexRender {cell} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
