<script lang="ts">
	import {
		createDataTable,
		Root as DataTable,
		type DataTableColumnDef
	} from '$lib/components/data-table';

	type Invoice = {
		id: string;
		customer: string;
		status: 'Paid' | 'Pending' | 'Overdue';
		items: number;
		paid: boolean;
		discountRate: number;
		total: number;
		url: string;
	};

	let data = $state<Invoice[]>([
		{
			id: 'INV-1001',
			customer: 'Acme Co.',
			status: 'Paid',
			items: 12,
			paid: true,
			discountRate: 0.075,
			total: 1240.34,
			url: 'https://example.com/invoices/inv-1001'
		},
		{
			id: 'INV-1002',
			customer: 'Northwind',
			status: 'Pending',
			items: 4,
			paid: false,
			discountRate: 0.05,
			total: 860.751,
			url: 'https://example.com/invoices/inv-1002'
		},
		{
			id: 'INV-1003',
			customer: 'Globex',
			status: 'Overdue',
			items: 18,
			paid: false,
			discountRate: 0.125,
			total: 1425.321,
			url: 'https://example.com/invoices/inv-1003'
		},
		{
			id: 'INV-1004',
			customer: 'Umbrella',
			status: 'Paid',
			items: 2,
			paid: true,
			discountRate: 0,
			total: 312.3,
			url: 'https://example.com/invoices/inv-1004'
		}
	]);

	const columns = [
		{
			accessorKey: 'id',
			header: 'Invoice'
		},
		{
			accessorKey: 'customer',
			header: 'Customer',
			cellType: 'text'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			accessorKey: 'items',
			header: 'Items',
			cellType: {
				type: 'number',
				maximumFractionDigits: 0
			}
		},
		{
			accessorKey: 'paid',
			header: 'Paid',
			cellType: {
				type: 'boolean',
				trueLabel: 'Paid',
				falseLabel: 'Open'
			}
		},
		{
			accessorKey: 'discountRate',
			header: 'Discount',
			cellType: {
				type: 'percentage',
				minimumFractionDigits: 1,
				maximumFractionDigits: 1
			}
		},
		{
			accessorKey: 'total',
			header: 'Total',
			cellType: {
				type: 'currency',
				currency: 'rsd',
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}
		},
		{
			accessorKey: 'url',
			header: 'Link',
			cellType: {
				type: 'link',
				href: (_, row) => row.url,
				target: '_blank',
				fallback: 'Open'
			}
		}
	] satisfies DataTableColumnDef<Invoice>[];

	const table = createDataTable({
		data: () => data,
		columns
	});

	function addInvoice() {
		data = [
			...data,
			{
				id: `INV-${1001 + data.length}`,
				customer: 'Stark Industries',
				status: 'Pending',
				items: 6,
				paid: false,
				discountRate: 0.1,
				total: 720,
				url: `https://example.com/invoices/inv-${1001 + data.length}`
			}
		];
	}
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<div class="mb-4 flex items-center justify-between gap-3">
			<h2 class="text-lg font-semibold">Data Table</h2>
			<button
				class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-ink-inverse"
				onclick={addInvoice}
				type="button"
			>
				Add invoice
			</button>
		</div>

		<DataTable {table} />
	</section>
</div>
