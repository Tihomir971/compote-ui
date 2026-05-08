<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import * as DataTableNew from '$lib/components/data-table';

	type Invoice = {
		id: string;
		customer: string;
		status: 'Paid' | 'Pending' | 'Overdue';
		items: number;
		total: number;
		owner: string;
		is_active: boolean;
	};

	let invoices = $state<Invoice[]>([
		{
			id: 'INV-1001',
			customer: 'Acme Co.',
			status: 'Paid',
			items: 12,
			total: 1240.34,
			owner: 'Mila',
			is_active: true
		},
		{
			id: 'INV-1002',
			customer: 'Northwind',
			status: 'Pending',
			items: 4,
			total: 860.75,
			owner: 'Petar',
			is_active: true
		},
		{
			id: 'INV-1003',
			customer: 'Globex',
			status: 'Overdue',
			items: 18,
			total: 1425.32,
			owner: 'Ana',
			is_active: false
		},
		{
			id: 'INV-1004',
			customer: 'Umbrella',
			status: 'Paid',
			items: 2,
			total: 312.3,
			owner: 'Marko',
			is_active: true
		}
	]);

	const column = DataTableNew.createDataTableColumnHelper<Invoice>();

	const columns = column.columns([
		column.group('Invoice', [
			column.group('Reference', [
				column.accessor('id', { header: 'Invoice' }),
				column.accessor('customer', { header: 'Customer' })
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
					align: 'right',
					formatLocale: 'sr-RS'
				})
			]),
			column.group('Assignment', [
				column.accessor('owner', { header: 'Owner' }),
				column.accessor('is_active', {
					header: 'Active',
					type: 'boolean',
					align: 'center',
					size: 90,
					enableResizing: false
				})
			])
		])
	]);

	const table = DataTableNew.createTable({
		get data() {
			return invoices;
		},
		columns,
		getRowId: (row) => row.id,
		enableRowSelection: true
	});

	function addInvoice() {
		invoices = [
			...invoices,
			{
				id: `INV-${1001 + invoices.length}`,
				customer: 'Stark Industries',
				status: 'Pending',
				items: 6,
				total: 720,
				owner: 'Natasha',
				is_active: true
			}
		];
	}
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section class="space-y-4">
		<DataTableNew.Toolbar>
			<DataTableNew.Title>Data Table New</DataTableNew.Title>

			{#snippet right()}
				<Button variant="outline" onclick={addInvoice}>Add invoice</Button>
				<DataTableNew.ColumnFilter {table} />
				<DataTableNew.ColumnVisibility {table} />
			{/snippet}
		</DataTableNew.Toolbar>

		<div class="h-96 min-h-0 max-w-3xl">
			<DataTableNew.Root {table} {columns} caption="Invoices" />
		</div>
	</section>
</div>
