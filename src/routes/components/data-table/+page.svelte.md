<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import { Splitter } from '$lib';
	import * as DataTable from '$lib/components/data-table';
	import * as VirtualDataTable from '$lib/components/data-table/virtual';
	import VendorPriceCell from './VendorPriceCell.svelte';

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
		typesCol.accessor('numberVal', { header: 'Number', type: 'number' }),
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

	type VendorPrice = {
		vendor: string;
		price: number;
		currency: string;
	};

	type Invoice = {
		id: string;
		url: string;
		customer: string;
		status: 'Paid' | 'Pending' | 'Overdue';
		items: number;
		total: number;
		vendorPrices: VendorPrice[];
		owner: string;
		is_active: boolean;
	};

	let invoices = $state<Invoice[]>([
		{
			id: 'INV-1001',
			url: 'https://example.com/invoices/inv-1001',
			customer: 'Acme Co.',
			status: 'Paid',
			items: 12,
			total: 1240.34,
			vendorPrices: [
				{ vendor: 'Metro Supply', price: 1180.2, currency: 'RSD' },
				{ vendor: 'Delta Trade', price: 1240.34, currency: 'RSD' },
				{ vendor: 'Novi Partner', price: 1215.5, currency: 'RSD' }
			],
			owner: 'Mila',
			is_active: true
		},
		{
			id: 'INV-1002',
			url: 'https://example.com/invoices/inv-1002',
			customer: 'Northwind',
			status: 'Pending',
			items: 4,
			total: 860.75,
			vendorPrices: [
				{ vendor: 'Metro Supply', price: 890.1, currency: 'RSD' },
				{ vendor: 'Delta Trade', price: 860.75, currency: 'RSD' },
				{ vendor: 'Novi Partner', price: 905, currency: 'RSD' }
			],
			owner: 'Petar',
			is_active: true
		},
		{
			id: 'INV-1003',
			url: 'https://example.com/invoices/inv-1003',
			customer: 'Globex',
			status: 'Overdue',
			items: 18,
			total: 1425.32,
			vendorPrices: [
				{ vendor: 'Metro Supply', price: 1425.32, currency: 'RSD' },
				{ vendor: 'Delta Trade', price: 1490, currency: 'RSD' },
				{ vendor: 'Novi Partner', price: 1458.8, currency: 'RSD' }
			],
			owner: 'Ana',
			is_active: false
		},
		{
			id: 'INV-1004',
			url: 'https://example.com/invoices/inv-1004',
			customer: 'Umbrella',
			status: 'Paid',
			items: 2,
			total: 312.3,
			vendorPrices: [
				{ vendor: 'Metro Supply', price: 330, currency: 'RSD' },
				{ vendor: 'Delta Trade', price: 312.3, currency: 'RSD' },
				{ vendor: 'Novi Partner', price: 318.45, currency: 'RSD' }
			],
			owner: 'Marko',
			is_active: true
		}
	]);

	const column = DataTable.createDataTableColumnHelper<Invoice>();

	const columns = column.columns([
		column.group('Invoice', [
			column.group('Reference', [
				column.accessor('id', { header: 'Invoice', pinned: 'left' }),
				column.accessor('url', {
					header: 'Link',
					type: 'url'
				}),
				column.accessor('customer', { header: 'Customer', grow: true })
			]),
			column.accessor('status', { header: 'Status', type: 'select' })
		]),
		column.group('Details', [
			column.group('Amount', [
				column.accessor('items', {
					header: 'Items',
					type: 'number',
					align: 'right',
					formatOptions: { maximumFractionDigits: 0 }
				}),
				column.accessor('total', {
					header: 'Total',
					type: 'currency',
					align: 'right'
				}),
				column.accessorFn((row) => Math.min(...row.vendorPrices.map((item) => item.price)), {
					id: 'vendorPrices',
					header: 'Vendor Prices',
					type: 'currency',
					align: 'right',
					cellComponent: VendorPriceCell,
					cellProps: (value, row) => ({
						value,
						prices: row.vendorPrices
					})
				})
			]),
			column.group('Assignment', [
				column.accessor('owner', { header: 'Owner' }),
				column.accessor('is_active', {
					header: 'Active',
					type: 'boolean',
					align: 'center',
					size: 90,
					pinned: 'right',
					enableResizing: false
				})
			])
		])
	]);

	const table = DataTable.createTable({
		get data() {
			return invoices;
		},
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});

	function createLargeInvoices(count: number): Invoice[] {
		const statuses: Invoice['status'][] = ['Paid', 'Pending', 'Overdue'];
		const owners = ['Mila', 'Petar', 'Ana', 'Marko', 'Natasha'];
		const customers = ['Acme Co.', 'Northwind', 'Globex', 'Umbrella', 'Stark Industries'];

		return Array.from({ length: count }, (_, index) => {
			const id = `INV-${(2000 + index).toString()}`;
			const total = 300 + ((index * 137) % 2400) + index / 100;
			return {
				id,
				url: `https://example.com/invoices/${id.toLowerCase()}`,
				customer: customers[index % customers.length],
				status: statuses[index % statuses.length],
				items: 1 + (index % 24),
				total,
				vendorPrices: [
					{ vendor: 'Metro Supply', price: total * 0.98, currency: 'RSD' },
					{ vendor: 'Delta Trade', price: total, currency: 'RSD' },
					{ vendor: 'Novi Partner', price: total * 1.03, currency: 'RSD' }
				],
				owner: owners[index % owners.length],
				is_active: index % 7 !== 0
			};
		});
	}

	const largeInvoices = createLargeInvoices(10000);

	const virtualTable = VirtualDataTable.createTable({
		data: largeInvoices,
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});

	function addInvoice() {
		invoices = [
			...invoices,
			{
				id: `INV-${1001 + invoices.length}`,
				url: `https://example.com/invoices/inv-${1001 + invoices.length}`,
				customer: 'Stark Industries',
				status: 'Pending',
				items: 6,
				total: 720,
				vendorPrices: [
					{ vendor: 'Metro Supply', price: 720, currency: 'RSD' },
					{ vendor: 'Delta Trade', price: 742.25, currency: 'RSD' },
					{ vendor: 'Novi Partner', price: 735.4, currency: 'RSD' }
				],
				owner: 'Natasha',
				is_active: true
			}
		];
	}

	let lastClicked = $state<Invoice | null>(null);
	let lastDoubleClicked = $state<Invoice | null>(null);
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
			<DataTable.Title>Data Table New</DataTable.Title>

    		{#snippet right()}
    			<Button variant="outline" onclick={addInvoice}>Add invoice</Button>
    			<DataTable.ColumnFilter {table} />
    			<DataTable.ColumnVisibility {table} />
    		{/snippet}
    	</DataTable.Toolbar>

    	<div class="h-96 min-h-0 max-w-3xl">
    		<DataTable.Root
    			{table}
    			caption="Invoices"
    			onRowClick={({ row }) => (lastClicked = row)}
    			onRowDoubleClick={({ row }) => (lastDoubleClicked = row)}
    		/>
    	</div>
    	<div class="flex items-center justify-between">
    		{#if lastClicked}
    			<p class="text-sm text-ink-dim">
    				Last clicked:
    				<span class="font-medium text-ink">{lastClicked.id} — {lastClicked.customer}</span>
    			</p>
    		{/if}
    		{#if lastDoubleClicked}
    			<p class="text-sm text-ink-dim">
    				Last double-clicked: <span class="font-medium text-ink">
    					{lastDoubleClicked.id} — {lastDoubleClicked.customer}
    				</span>
    			</p>
    		{/if}
    	</div>
    </section>

    <section class="space-y-4">
    	<VirtualDataTable.Toolbar>
    		<VirtualDataTable.Title>Data Table Virtualized</VirtualDataTable.Title>

    		{#snippet right()}
    			<VirtualDataTable.ColumnFilter table={virtualTable} />
    			<VirtualDataTable.ColumnVisibility table={virtualTable} />
    		{/snippet}
    	</VirtualDataTable.Toolbar>

    	<div class="h-96 min-h-0 max-w-3xl">
    		<VirtualDataTable.Root
    			table={virtualTable}
    			caption="Virtualized invoices"
    			onRowClick={({ row }) => (lastClicked = row)}
    			onRowDoubleClick={({ row }) => (lastDoubleClicked = row)}
    		/>
    	</div>
    	{#if lastClicked}
    		<p class="text-sm text-ink-dim">
    			Last clicked:
    			<span class="font-medium text-ink">{lastClicked.id} — {lastClicked.customer}</span>
    		</p>
    	{/if}
    	{#if lastDoubleClicked}
    		<p class="text-sm text-ink-dim">
    			Last double-clicked: <span class="font-medium text-ink"
    				>{lastDoubleClicked.id} — {lastDoubleClicked.customer}</span
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
					<DataTable.Root {table} caption="Invoices" />
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
					<VirtualDataTable.Root table={virtualTable} caption="Virtualized invoices" />
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
