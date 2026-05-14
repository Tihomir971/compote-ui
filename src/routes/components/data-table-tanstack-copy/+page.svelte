<script lang="ts">
	import {
		columnFilteringFeature,
		createFilteredRowModel,
		createTable,
		filterFns,
		FlexRender,
		globalFilteringFeature,
		rowSelectionFeature,
		tableFeatures
	} from '@tanstack/svelte-table';
	import { makeData } from './makeData';
	import type { Person } from './makeData';
	import type { Column, SvelteTable } from '@tanstack/svelte-table';
	import './index.css';

	const _features = tableFeatures({
		rowSelectionFeature,
		columnFilteringFeature,
		globalFilteringFeature
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

	// Svelte action to set indeterminate property on checkbox inputs
	function setIndeterminate(node: HTMLInputElement, value: boolean) {
		node.indeterminate = value;
		return {
			update(newValue: boolean) {
				node.indeterminate = newValue;
			}
		};
	}

	// Create table with selector to track specific state
	const table = createTable(
		{
			_features,
			_rowModels: {
				filteredRowModel: createFilteredRowModel(filterFns)
			},
			get data() {
				return data;
			},
			columns: [
				{
					id: 'select',
					header: () => 'select',
					cell: ({ row }) => row.getIsSelected()
				},
				{
					header: 'Name',
					footer: (props) => props.column.id,
					columns: [
						{
							accessorKey: 'firstName',
							cell: (info) => info.getValue(),
							footer: (props) => props.column.id
						},
						{
							accessorFn: (row) => row.lastName,
							id: 'lastName',
							cell: (info) => info.getValue(),
							header: () => 'Last Name',
							footer: (props) => props.column.id
						}
					]
				},
				{
					header: 'Info',
					footer: (props) => props.column.id,
					columns: [
						{
							accessorKey: 'age',
							header: () => 'Age',
							footer: (props) => props.column.id
						},
						{
							header: 'More Info',
							columns: [
								{
									accessorKey: 'visits',
									header: () => 'Visits',
									footer: (props) => props.column.id
								},
								{
									accessorKey: 'status',
									header: 'Status',
									footer: (props) => props.column.id
								},
								{
									accessorKey: 'progress',
									header: 'Profile Progress',
									footer: (props) => props.column.id
								}
							]
						}
					]
				}
			],
			getRowId: (row) => row.id,
			enableRowSelection: true,
			debugTable: true
		},
		(state) => ({
			rowSelection: state.rowSelection,
			globalFilter: state.globalFilter
		})
	);
</script>

<div class="demo-root">
	<div style="display: flex; align-items: center; gap: 12px;">
		<button onclick={() => refreshData()}>Regenerate Data</button>
		<button onclick={() => stressTest()}>Stress Test (200k rows)</button>
		{#if paintMs !== null}
			<span>paint: <strong>{paintMs.toFixed(1)} ms</strong></span>
		{/if}
	</div>
	<div>
		<input
			value={table.state.globalFilter ?? ''}
			oninput={(e) => table.setGlobalFilter((e.target as HTMLInputElement).value)}
			class="summary-panel"
			placeholder="Search all columns..."
		/>
	</div>
	<div class="spacer-sm"></div>
	<table>
		<thead>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<tr>
					{#each headerGroup.headers as header (header.id)}
						<th colSpan={header.colSpan}>
							{#if !header.isPlaceholder}
								{#if header.id === 'select'}
									<input
										type="checkbox"
										checked={table.getIsAllRowsSelected()}
										use:setIndeterminate={!table.getIsAllRowsSelected() &&
											table.getIsSomeRowsSelected()}
										onchange={table.getToggleAllRowsSelectedHandler()}
										class="sortable-header"
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
				<tr>
					{#each row.getAllCells() as cell (cell.id)}
						<td>
							{#if cell.column.id === 'select'}
								<input
									type="checkbox"
									checked={row.getIsSelected()}
									disabled={!row.getCanSelect()}
									use:setIndeterminate={!row.getIsSelected() && row.getIsSomeSelected()}
									onchange={row.getToggleSelectedHandler()}
									class="sortable-header"
								/>
							{:else}
								<FlexRender {cell} />
							{/if}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td class="cell-padding">
					<input
						type="checkbox"
						checked={table.getIsAllPageRowsSelected()}
						use:setIndeterminate={!table.getIsAllPageRowsSelected() &&
							table.getIsSomePageRowsSelected()}
						onchange={table.getToggleAllPageRowsSelectedHandler()}
						class="sortable-header"
					/>
				</td>
				<td colSpan={20}>Page Rows ({table.getRowModel().rows.length.toLocaleString()})</td>
			</tr>
		</tfoot>
	</table>
	<div class="spacer-sm"></div>

	<br />
	<div>
		{Object.keys(table.state.rowSelection).length.toLocaleString()} of
		{table.getPreFilteredRowModel().rows.length.toLocaleString()} Total Rows Selected
	</div>
	<hr />
	<br />
	<div>
		<button class="demo-button demo-button-spaced" onclick={() => refreshData()}>
			Regenerate Data
		</button>
		<button class="demo-button demo-button-spaced" onclick={() => stressTest()}>
			Stress Test (200k rows)
		</button>
	</div>
	<div>
		<button
			class="demo-button demo-button-spaced"
			onclick={() =>
				console.info('table.getSelectedRowModel().flatRows', table.getSelectedRowModel().flatRows)}
		>
			Log table.getSelectedRowModel().flatRows
		</button>
	</div>
	<div>
		<strong>Row Selection State:</strong>
		<pre>{JSON.stringify(table.state, null, 2)}</pre>
	</div>
</div>

{#snippet Filter(
	column: Column<typeof _features, Person>,
	table: SvelteTable<typeof _features, Person, unknown>
)}
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
			placeholder="Search..."
			class="filter-select"
		/>
	{/if}
{/snippet}
