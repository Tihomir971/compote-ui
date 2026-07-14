<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import * as DataTable from '$lib/components/data-table-v9';
	import * as VirtualDataTable from '$lib/components/data-table-v9/virtual';
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
		phoneVal: string;
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
			phoneVal: '+12015550123',
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
			phoneVal: '+381601234567',
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
			phoneVal: '',
			dateVal: new Date('NaN'),
			timeVal: new Date('NaN'),
			datetimeVal: new Date('NaN')
		}
	];

	const typesCol = DataTable.createDataTableColumnHelper<TypesRow>();
	const typesColumns = typesCol.columns([
		typesCol.group('Group', [
			typesCol.accessor('label', { header: 'Label', type: 'text', pinned: 'left' }),
			typesCol.accessor('textVal', { header: 'Text', type: 'text' })
		]),
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
		typesCol.accessor('phoneVal', { header: 'Phone', type: 'phone' }),
		typesCol.accessor('dateVal', { header: 'Date', type: 'date' }),
		typesCol.accessor('timeVal', { header: 'Time', type: 'time' }),
		typesCol.accessor('datetimeVal', { header: 'Date-Time', type: 'date-time' })
	]);

	const typesTable = DataTable.createTable({
		data: typesRows,
		columns: typesColumns,
		getRowId: (row) => row.label
	});

	type SaleRow = {
		product: string;
		units: number;
		price: number;
		revenue: number;
		margin: number;
	};

	const salesRows: SaleRow[] = [
		{ product: 'Widget A', units: 120, price: 9.99, revenue: 1198.8, margin: 0.42 },
		{ product: 'Widget B', units: 45, price: 24.5, revenue: 1102.5, margin: 0.31 },
		{ product: 'Gadget Pro', units: 8, price: 199.0, revenue: 1592.0, margin: 0.58 },
		{ product: 'Gadget Lite', units: 200, price: 14.99, revenue: 2998.0, margin: 0.27 },
		{ product: 'Doohickey', units: 33, price: 49.95, revenue: 1648.35, margin: 0.49 }
	];

	const salesCol = DataTable.createDataTableColumnHelper<SaleRow>();
	const salesColumns = salesCol.columns([
		salesCol.accessor('product', { header: 'Product', type: 'text', grow: true }),
		salesCol.accessor('units', { header: 'Units', type: 'number', size: 90, sum: true }),
		salesCol.accessor('price', { header: 'Unit Price', type: 'currency', size: 110 }),
		salesCol.accessor('revenue', { header: 'Revenue', type: 'currency', size: 120, sum: true }),
		salesCol.accessor('margin', {
			header: 'Avg Margin',
			type: 'percent',
			size: 120,
			footer: (values) => {
				const nums = values.filter((v) => typeof v === 'number') as number[];
				return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : undefined;
			}
		})
	]);

	const salesTable = DataTable.createTable({
		data: salesRows,
		columns: salesColumns,
		getRowId: (row) => row.product
	});

	// Reactive columns demo — the columns array lives in $state and is passed
	// through a getter, so adding/removing/reordering columns updates the table.
	const reactiveCol = DataTable.createDataTableColumnHelper<SaleRow>();
	const productColumn = reactiveCol.accessor('product', {
		header: 'Product',
		type: 'text',
		grow: true
	});
	const unitsColumn = reactiveCol.accessor('units', { header: 'Units', type: 'number', size: 90 });
	const priceColumn = reactiveCol.accessor('price', {
		header: 'Unit Price',
		type: 'currency',
		size: 110
	});
	const revenueColumn = reactiveCol.accessor('revenue', {
		header: 'Revenue',
		type: 'currency',
		size: 120
	});
	const marginColumn = reactiveCol.accessor('margin', {
		header: 'Margin',
		type: 'percent',
		size: 100
	});

	// $state.raw keeps the column objects un-proxied so identity comparisons
	// (includes / !==) work and the table receives the original column defs.
	let reactiveColumns = $state.raw([productColumn, unitsColumn, priceColumn]);

	const reactiveTable = DataTable.createTable({
		data: salesRows,
		get columns() {
			return reactiveColumns;
		},
		getRowId: (row) => row.product
	});

	function toggleRevenueColumn() {
		reactiveColumns = reactiveColumns.includes(revenueColumn)
			? reactiveColumns.filter((c) => c !== revenueColumn)
			: [...reactiveColumns, revenueColumn];
	}

	function toggleMarginColumn() {
		reactiveColumns = reactiveColumns.includes(marginColumn)
			? reactiveColumns.filter((c) => c !== marginColumn)
			: [...reactiveColumns, marginColumn];
	}

	function reverseColumns() {
		reactiveColumns = [...reactiveColumns].reverse();
	}

	// Global search over a nullable text column. The FIRST row's `nickname` is
	// null; a later row has a searchable value ("Sparrow"). TanStack's default
	// getColumnCanGlobalFilter would exclude the whole column because the first
	// value isn't a string/number — the override treats null/undefined as
	// "unknown → allow" so the search still matches later rows. The boolean and
	// object columns stay excluded from global search (searching "true" or
	// "[object" matches nothing).
	type NullableRow = {
		name: string;
		nickname: string | null;
		active: boolean;
		meta: { region: string };
	};

	const nullableRows: NullableRow[] = [
		{ name: 'Alice', nickname: null, active: true, meta: { region: 'North' } },
		{ name: 'Bob', nickname: 'Sparrow', active: false, meta: { region: 'South' } },
		{ name: 'Carol', nickname: 'Falcon', active: true, meta: { region: 'East' } }
	];

	const nullableCol = DataTable.createDataTableColumnHelper<NullableRow>();
	const nullableColumns = nullableCol.columns([
		nullableCol.accessor('name', { header: 'Name', type: 'text', grow: true }),
		nullableCol.accessor('nickname', { header: 'Nickname', type: 'text' }),
		nullableCol.accessor('active', { header: 'Active', type: 'boolean', size: 100 }),
		nullableCol.accessor('meta', {
			header: 'Region',
			cell: (value) => (value as { region: string }).region,
			size: 120
		})
	]);

	const nullableTable = DataTable.createTable({
		data: nullableRows,
		columns: nullableColumns,
		getRowId: (row) => row.name
	});

	const personCol = DataTable.createDataTableColumnHelper<Person>();
	const personColumns = personCol.columns([
		personCol.group('Name', [
			personCol.accessor('firstName', {
				header: 'First Name',
				type: 'text',
				grow: true,
				enableColumnFilter: true,
				pinned: 'left',
				enableHiding: false
			}),
			personCol.accessor('lastName', {
				header: 'Last Name',
				type: 'select',
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

	const personTable = DataTable.createTable({
		get data() {
			return data;
		},
		columns: personColumns,
		getRowId: (row) => row.id,
		enableRowSelection: true,
		enableMultiRowSelection: true
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
		{#snippet right()}
			<DataTable.ColumnFilter table={typesTable} />
		{/snippet}
	</DataTable.Toolbar>
	<div class="h-48 min-h-0">
		<DataTable.Root table={typesTable} caption="Column type examples" />
	</div>
</div>

<div class="max-w-2xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<DataTable.Toolbar>
		<DataTable.Title>Column Footer / Sum</DataTable.Title>
	</DataTable.Toolbar>
	<div class="h-56 min-h-0">
		<DataTable.Root table={salesTable} caption="Sales summary" />
	</div>
</div>

<div class="max-w-2xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<DataTable.Toolbar>
		<DataTable.Title>Search — Nullable First Row</DataTable.Title>
		{#snippet right()}
			<DataTable.Search table={nullableTable} class="w-56" />
		{/snippet}
	</DataTable.Toolbar>
	<p class="text-sm text-ink-dim">
		Search “Sparrow” or “Falcon” — the Nickname column is searchable even though the first row’s
		value is <code>null</code>. Boolean/object columns stay excluded.
	</p>
	<div class="h-48 min-h-0">
		<DataTable.Root table={nullableTable} caption="Nullable-first-row search" />
	</div>
</div>

<div class="max-w-2xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<DataTable.Toolbar>
		<DataTable.Title>Reactive Columns</DataTable.Title>
		{#snippet right()}
			<Button variant="outline" onclick={toggleRevenueColumn}>Toggle Revenue</Button>
			<Button variant="outline" onclick={toggleMarginColumn}>Toggle Margin</Button>
			<Button variant="outline" onclick={reverseColumns}>Reverse Order</Button>
		{/snippet}
	</DataTable.Toolbar>
	<div class="h-56 min-h-0">
		<DataTable.Root table={reactiveTable} caption="Reactive columns" />
	</div>
</div>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section class="space-y-4">
		<DataTable.Toolbar>
			<DataTable.Title>Data Table V9</DataTable.Title>
			{#snippet center()}
				<DataTable.Search table={personTable} class="w-56" />
			{/snippet}
			{#snippet right()}
				<Button variant="outline" onclick={refreshData}>Regenerate Data</Button>
				<DataTable.ColumnFilter table={personTable} />
				<DataTable.ColumnVisibility table={personTable} />
			{/snippet}
		</DataTable.Toolbar>

		<div class="h-96 min-h-0 max-w-3xl">
			<DataTable.Root
				table={personTable}
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
			<VirtualDataTable.Title>Data Table V9 Virtualized</VirtualDataTable.Title>
			{#snippet center()}
				<VirtualDataTable.Search table={virtualTable} class="w-56" />
			{/snippet}
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
