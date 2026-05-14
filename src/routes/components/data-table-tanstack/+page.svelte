<script lang="ts">
	import {
		columnFilteringFeature,
		createColumnHelper,
		createFilteredRowModel,
		createTable,
		filterFns,
		FlexRender,
		rowSelectionFeature,
		tableFeatures
	} from '@tanstack/svelte-table';
	import type { Column, SvelteTable } from '@tanstack/svelte-table';
	import { makeData } from './makeData';
	import type { Person } from './makeData';
	import Button from '$lib/components/button/button.svelte';

	const _features = tableFeatures({
		rowSelectionFeature,
		columnFilteringFeature
	});

	let data = $state(makeData(100));
	let paintMs = $state<number | null>(null);
	let measureStart = 0;

	function measure() {
		measureStart = performance.now();
	}
	function afterPaint() {
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				paintMs = performance.now() - measureStart;
			});
		});
	}

	const refreshData = () => {
		measure();
		data = makeData(100);
		afterPaint();
	};
	const stressTest = () => {
		measure();
		data = makeData(200_000);
		afterPaint();
	};

	const columnHelper = createColumnHelper<typeof _features, Person>();
	const columns = columnHelper.columns([
		columnHelper.display({
			id: 'select',
			header: () => 'select',
			cell: ({ row }) => row.getIsSelected()
		}),
		columnHelper.group({
			header: 'Name',
			columns: columnHelper.columns([
				columnHelper.accessor('firstName', { cell: (info) => info.getValue() }),
				columnHelper.accessor((row) => row.lastName, {
					id: 'lastName',
					header: () => 'Last Name',
					cell: (info) => info.getValue()
				})
			])
		}),
		columnHelper.group({
			header: 'Info',
			columns: columnHelper.columns([
				columnHelper.accessor('age', { header: () => 'Age' }),
				columnHelper.group({
					header: 'More Info',
					columns: columnHelper.columns([
						columnHelper.accessor('visits', { header: () => 'Visits' }),
						columnHelper.accessor('status', { header: 'Status' }),
						columnHelper.accessor('progress', { header: 'Profile Progress' })
					])
				})
			])
		})
	]);

	function setIndeterminate(node: HTMLInputElement, value: boolean) {
		node.indeterminate = value;
		return {
			update(newValue: boolean) {
				node.indeterminate = newValue;
			}
		};
	}

	const table = createTable(
		{
			_features,
			_rowModels: {
				filteredRowModel: createFilteredRowModel(filterFns)
			},
			get data() {
				return data;
			},
			columns,
			getRowId: (row) => row.id,
			enableRowSelection: true
		},
		(state) => ({
			rowSelection: state.rowSelection
		})
	);
</script>

<div class="demo-root">
	<div class="flex items-center gap-3">
		<Button onclick={() => refreshData()}>Regenerate Data</Button>
		<Button onclick={() => stressTest()}>Stress Test (200k rows)</Button>
		{#if paintMs !== null}
			<span class="text-sm text-ink-dim">paint: <strong>{paintMs.toFixed(1)} ms</strong></span>
		{/if}
	</div>

	<div class="spacer-sm"></div>

	<div
		class="flex max-h-150 min-h-0 flex-col overflow-hidden rounded-lg border border-surface-3 bg-surface-1"
	>
		<div class="min-h-0 flex-1 overflow-auto">
			<table class="w-full border-separate border-spacing-0 text-sm">
				<thead class="sticky top-0 z-20 bg-surface-2 text-left text-ink-dim">
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<tr class="h-9">
							{#each headerGroup.headers as header (header.id)}
								<th
									class="h-9 border-b border-surface-3 bg-surface-2 px-3 py-0 align-middle font-medium"
									colSpan={header.colSpan}
								>
									{#if !header.isPlaceholder}
										{#if header.id === 'select'}
											<input
												type="checkbox"
												checked={table.getIsAllRowsSelected()}
												use:setIndeterminate={!table.getIsAllRowsSelected() &&
													table.getIsSomeRowsSelected()}
												onchange={table.getToggleAllRowsSelectedHandler()}
											/>
										{:else}
											<FlexRender {header} />
										{/if}
										{#if header.column.getCanFilter()}
											<div>
												{@render Filter(header.column, table)}
											</div>
										{/if}
									{/if}
								</th>
							{/each}
						</tr>
					{/each}
				</thead>
				<tbody>
					{#each table.getRowModel().rows as row (row.id)}
						{@const isSelected = row.getIsSelected()}
						<tr
							class="group/row [--row-bg:var(--compote-surface-1)] hover:bg-well/60 hover:[--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))] {isSelected
								? 'bg-well/60 [--row-bg:color-mix(in_srgb,var(--compote-well)_60%,var(--compote-surface-1))]'
								: ''}"
						>
							{#each row.getAllCells() as cell (cell.id)}
								<td class="border-b border-surface-2 px-3 py-2 group-last/row:border-b-0">
									{#if cell.column.id === 'select'}
										<input
											type="checkbox"
											checked={isSelected}
											disabled={!row.getCanSelect()}
											use:setIndeterminate={!isSelected && row.getIsSomeSelected()}
											onchange={row.getToggleSelectedHandler()}
										/>
									{:else}
										<FlexRender {cell} />
									{/if}
								</td>
							{/each}
						</tr>
					{:else}
						<tr>
							<td class="px-3 py-10 text-center text-sm text-ink-dim" colspan={99}>
								No rows found
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="shrink-0 border-t border-surface-3 bg-surface-2 px-3 py-2 text-sm text-ink-dim">
			{Object.keys(table.state.rowSelection).length} of {table.getPreFilteredRowModel().rows.length} rows
			selected
		</div>
	</div>

	<div class="spacer-sm"></div>
	<div>
		<strong>Row Selection State:</strong>
		<pre>{JSON.stringify(table.state, null, 2)}</pre>
	</div>
</div>

{#snippet Filter(column: Column<typeof _features, Person>, table: SvelteTable<typeof _features, Person, unknown>)}
	{@const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id)}

	{#if typeof firstValue === 'number'}
		<div class="filter-row">
			<input
				type="number"
				value={((
					column.getFilterValue() as
						| [number | string | undefined, number | string | undefined]
						| undefined
				)?.[0] ?? '') as string}
				oninput={(e) =>
					column.setFilterValue(
						(old: [number | string | undefined, number | string | undefined] | undefined) => [
							(e.target as HTMLInputElement).value,
							old?.[1]
						]
					)}
				placeholder="Min"
				class="filter-input"
			/>
			<input
				type="number"
				value={((
					column.getFilterValue() as
						| [number | string | undefined, number | string | undefined]
						| undefined
				)?.[1] ?? '') as string}
				oninput={(e) =>
					column.setFilterValue(
						(old: [number | string | undefined, number | string | undefined] | undefined) => [
							old?.[0],
							(e.target as HTMLInputElement).value
						]
					)}
				placeholder="Max"
				class="filter-input"
			/>
		</div>
	{:else}
		<input
			type="text"
			value={(column.getFilterValue() ?? '') as string}
			oninput={(e) => column.setFilterValue((e.target as HTMLInputElement).value)}
			placeholder="Search"
			class="filter-select"
		/>
	{/if}
{/snippet}
