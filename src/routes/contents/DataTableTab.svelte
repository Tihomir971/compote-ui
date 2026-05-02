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
		total: number;
	};

	let data = $state<Invoice[]>([
		{ id: 'INV-1001', customer: 'Acme Co.', status: 'Paid', total: 1240.34 },
		{ id: 'INV-1002', customer: 'Northwind', status: 'Pending', total: 860.751 },
		{ id: 'INV-1003', customer: 'Globex', status: 'Overdue', total: 1425.321 },
		{ id: 'INV-1004', customer: 'Umbrella', status: 'Paid', total: 312.3 }
	]);

	const columns = [
		{
			accessorKey: 'id',
			header: 'Invoice'
		},
		{
			accessorKey: 'customer',
			header: 'Customer'
		},
		{
			accessorKey: 'status',
			header: 'Status'
		},
		{
			accessorKey: 'total',
			header: 'Total',
			cellType: {
				type: 'currency',
				currency: 'USD',
				maximumFractionDigits: 2
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
				total: 720
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
