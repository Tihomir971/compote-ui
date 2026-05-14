<script lang="ts">
	import { FlexRender, createColumnHelper } from '@tanstack/svelte-table';
	import type { Column } from '@tanstack/svelte-table';
	import { makeData } from './makeData';
	import type { Person } from './makeData';
	import './index.css';
	import Button from '$lib/components/button/button.svelte';
	import { createTable, type DtFeatures, type DtInstance } from './create-table';

	let data = $state(makeData(100));
	const refreshData = () => {
		data = makeData(100);
	};
	const stressTest = () => {
		data = makeData(200_000);
	};

	function setIndeterminate(node: HTMLInputElement, value: boolean) {
		node.indeterminate = value;
		return {
			update(newValue: boolean) {
				node.indeterminate = newValue;
			}
		};
	}

	const columnHelper = createColumnHelper<DtFeatures, Person>();
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

	const table = createTable({
		get data() {
			return data;
		},
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});
</script>

<div class="demo-root">
	<div>
		<Button onclick={() => refreshData()}>Regenerate Data</Button>
		<Button onclick={() => stressTest()}>Stress Test (200k rows)</Button>
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
				<td colSpan={20}>Rows ({table.getRowModel().rows.length.toLocaleString()})</td>
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

{#snippet Filter(column: Column<DtFeatures, Person>, table: DtInstance<Person>)}
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
