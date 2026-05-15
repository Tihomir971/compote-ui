<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import { Splitter } from '$lib';
	import * as DataTable from '$lib/components/data-table-v8';
	import * as VirtualDataTable from '$lib/components/data-table-v8/virtual';
	import { makeData, type Person } from './makeData.ts';

	type TypesRow = {
		label: string;
		textVal: string;
		numberVal: number;
		currencyVal: number;
		percentVal: number;
		booleanVal: boolean;
		selectVal: string;
		urlVal: string;
		dateVal: Date;
		timeVal: Date;
		datetimeVal: Date;
	};

	const typesRows: TypesRow[] = [
		{
			label: 'Row A',
			textVal: 'Hello world',
			numberVal: 42000,
			currencyVal: 1899.99,
			percentVal: 0.742,
			booleanVal: true,
			selectVal: 'Active',
			urlVal: 'https://example.com',
			dateVal: new Date('2024-03-15'),
			timeVal: new Date('2024-03-15T09:30:00'),
			datetimeVal: new Date('2024-03-15T09:30:00')
		},
		{
			label: 'Row B',
			textVal: 'Foo bar',
			numberVal: 1500.5,
			currencyVal: 299,
			percentVal: 0.123,
			booleanVal: false,
			selectVal: 'Inactive',
			urlVal: 'https://svelte.dev',
			dateVal: new Date('2025-11-01'),
			timeVal: new Date('2025-11-01T14:45:00'),
			datetimeVal: new Date('2025-11-01T14:45:00')
		},
		{
			label: 'Row C',
			textVal: '',
			numberVal: 0,
			currencyVal: 0,
			percentVal: 0,
			booleanVal: false,
			selectVal: 'Pending',
			urlVal: '',
			dateVal: new Date('NaN'),
			timeVal: new Date('NaN'),
			datetimeVal: new Date('NaN')
		}
	];

	const typesCol = DataTable.createDataTableColumnHelper<TypesRow>();
	const typesColumns = typesCol.columns([
		typesCol.accessor('label', { header: 'Label', type: 'text' }),
		typesCol.accessor('textVal', { header: 'Text', type: 'text' }),
		typesCol.accessor('numberVal', {
			header: 'Number',
			type: 'number',
			formatOptions: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
		}),
		typesCol.accessor('currencyVal', { header: 'Currency', type: 'currency' }),
		typesCol.accessor('percentVal', { header: 'Percent', type: 'percent' }),
		typesCol.accessor('booleanVal', { header: 'Boolean', type: 'boolean' }),
		typesCol.accessor('selectVal', { header: 'Select', type: 'select' }),
		typesCol.accessor('urlVal', { header: 'URL', type: 'url' }),
		typesCol.accessor('dateVal', { header: 'Date', type: 'date' }),
		typesCol.accessor('timeVal', { header: 'Time', type: 'time' }),
		typesCol.accessor('datetimeVal', { header: 'Date-Time', type: 'date-time' })
	]);

	const typesTable = DataTable.createTable({
		data: typesRows,
		columns: typesColumns,
		getRowId: (row) => row.label
	});

	const personCol = DataTable.createDataTableColumnHelper<Person>();
	const personColumns = personCol.columns([
		personCol.group('Name', [
			personCol.accessor('firstName', {
				header: 'First Name',
				type: 'text',
				grow: true,
				enableColumnFilter: true
			}),
			personCol.accessor('lastName', {
				header: 'Last Name',
				type: 'text',
				size: 140,
				enableColumnFilter: true
			})
		]),
		personCol.group('Info', [
			personCol.accessor('age', {
				header: 'Age',
				type: 'number',
				size: 80,
				enableColumnFilter: true
			}),
			personCol.accessor('visits', { header: 'Visits', type: 'number', size: 80 }),
			personCol.accessor('progress', { header: 'Progress', type: 'number', size: 90 }),
			personCol.accessor('status', {
				header: 'Status',
				type: 'select',
				size: 130,
				enableColumnFilter: true
			})
		])
	]);

	let data = $state(makeData(100));
	let virtualData = $state(makeData(1_000));

	const table = DataTable.createTable({
		get data() {
			return data;
		},
		columns: personColumns,
		getRowId: (row) => row.id,
		enableRowSelection: true,
		enableMultiRowSelection: true,
		onColumnVisibilityChange: (visibility) => {
			console.log('visibility:', JSON.stringify(visibility, null, 3));
		}
	});

	const virtualTable = VirtualDataTable.createTable({
		get data() {
			return virtualData;
		},
		columns: personColumns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});

	function refreshData() {
		console.log('New data');
		data = makeData(100);
	}

	function refreshVirtualData() {
		virtualData = makeData(1_000);
	}

	let lastClicked = $state<Person | null>(null);
	let lastDoubleClicked = $state<Person | null>(null);
</script>

<div class="max-w-5xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<DataTable.Toolbar>
		<DataTable.Title>Column Types</DataTable.Title>
	</DataTable.Toolbar>
	<div class="h-48 min-h-0">
		<DataTable.Root table={typesTable} caption="Column type examples" />
	</div>
</div>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section class="space-y-4">
		<DataTable.Toolbar>
			<DataTable.Title>Data Table V8</DataTable.Title>

			{#snippet right()}
				<Button variant="outline" onclick={refreshData}>Regenerate Data</Button>
				<DataTable.ColumnFilter {table} />
				<DataTable.ColumnVisibility {table} />
			{/snippet}
		</DataTable.Toolbar>

		<div class="h-96 min-h-0 max-w-3xl">
			<DataTable.Root
				{table}
				caption="People"
				onRowClick={({ row }) => (lastClicked = row)}
				onRowDoubleClick={({ row }) => (lastDoubleClicked = row)}
			/>
		</div>
		<div class="flex items-center justify-between">
			{#if lastClicked}
				<p class="text-sm text-ink-dim">
					Last clicked:
					<span class="font-medium text-ink">{lastClicked.firstName} {lastClicked.lastName}</span>
				</p>
			{/if}
			{#if lastDoubleClicked}
				<p class="text-sm text-ink-dim">
					Last double-clicked: <span class="font-medium text-ink">
						{lastDoubleClicked.firstName}
						{lastDoubleClicked.lastName}
					</span>
				</p>
			{/if}
		</div>
	</section>

	<section class="space-y-4">
		<VirtualDataTable.Toolbar>
			<VirtualDataTable.Title>Data Table V8 Virtualized</VirtualDataTable.Title>

			{#snippet right()}
				<Button variant="outline" onclick={refreshVirtualData}>Regenerate Data</Button>
				<VirtualDataTable.ColumnFilter table={virtualTable} />
				<VirtualDataTable.ColumnVisibility table={virtualTable} />
			{/snippet}
		</VirtualDataTable.Toolbar>

		<div class="h-96 min-h-0 max-w-3xl">
			<VirtualDataTable.Root
				table={virtualTable}
				caption="Virtualized people"
				onRowClick={({ row }) => (lastClicked = row)}
				onRowDoubleClick={({ row }) => (lastDoubleClicked = row)}
			/>
		</div>
		{#if lastClicked}
			<p class="text-sm text-ink-dim">
				Last clicked:
				<span class="font-medium text-ink">{lastClicked.firstName} {lastClicked.lastName}</span>
			</p>
		{/if}
		{#if lastDoubleClicked}
			<p class="text-sm text-ink-dim">
				Last double-clicked: <span class="font-medium text-ink"
					>{lastDoubleClicked.firstName} {lastDoubleClicked.lastName}</span
				>
			</p>
		{/if}
	</section>
</div>

<div class="mt-5 w-full max-w-none space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<h2 class="text-lg font-semibold">Tables in Splitter</h2>
	<div class="h-125 w-full overflow-hidden">
		{#snippet leftPanel()}
			<div class="flex h-full min-h-0 flex-col overflow-hidden p-2">
				<DataTable.Toolbar>
					<DataTable.Title>Regular</DataTable.Title>
					{#snippet right()}
						<DataTable.ColumnFilter {table} />
						<DataTable.ColumnVisibility {table} />
					{/snippet}
				</DataTable.Toolbar>
				<div class="mt-2 min-h-0 flex-1">
					<DataTable.Root {table} caption="People" />
				</div>
			</div>
		{/snippet}
		{#snippet rightPanel()}
			<div class="flex h-full min-h-0 flex-col overflow-hidden p-2">
				<VirtualDataTable.Toolbar>
					<VirtualDataTable.Title>Virtualized</VirtualDataTable.Title>
					{#snippet right()}
						<VirtualDataTable.ColumnFilter table={virtualTable} />
						<VirtualDataTable.ColumnVisibility table={virtualTable} />
					{/snippet}
				</VirtualDataTable.Toolbar>
				<div class="mt-2 min-h-0 flex-1">
					<VirtualDataTable.Root table={virtualTable} caption="Virtualized people" />
				</div>
			</div>
		{/snippet}
		<Splitter
			panels={[
				{ id: 'left', minSize: 10, content: leftPanel },
				{ id: 'right', minSize: 10, content: rightPanel }
			]}
		/>
	</div>
</div>
