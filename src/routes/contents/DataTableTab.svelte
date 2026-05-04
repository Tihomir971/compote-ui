<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import * as DataTable from '$lib/components/data-table';
	import { createDataTable, type DataTableColumnDef } from '$lib/components/data-table';

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
			header: 'Invoice',
			columns: [
				{
					accessorKey: 'id',
					header: 'Number',
					size: 100,
					enableResizing: false,
					enableHiding: false,
					sortDescFirst: false
				},
				{
					accessorKey: 'customer',
					header: 'Customer',
					cellType: 'text',
					size: 180,
					minSize: 140,
					sortDescFirst: false
				},
				{
					accessorKey: 'status',
					header: 'Status',
					size: 120
				}
			]
		},
		{
			header: 'Payment',
			columns: [
				{
					accessorKey: 'items',
					header: 'Items',
					size: 90,
					minSize: 72,
					sortDescFirst: true,
					cellType: {
						type: 'number',
						maximumFractionDigits: 0
					}
				},
				{
					accessorKey: 'paid',
					header: 'Paid',
					size: 100,
					cellType: {
						type: 'boolean',
						trueLabel: 'Paid',
						falseLabel: 'Open'
					}
				},
				{
					accessorKey: 'discountRate',
					header: 'Discount',
					size: 120,
					cellType: {
						type: 'percentage',
						minimumFractionDigits: 1,
						maximumFractionDigits: 1
					}
				},
				{
					accessorKey: 'total',
					header: 'Total',
					size: 140,
					minSize: 110,
					sortDescFirst: true,
					cellType: {
						type: 'currency',
						currency: 'rsd',
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}
				}
			]
		},
		{
			accessorKey: 'url',
			header: 'Link',
			align: 'center',
			size: 80,
			minSize: 64,
			enableResizing: false,
			enableSorting: false,
			enableHiding: false,
			cellType: {
				type: 'link',
				target: '_blank',
				fallback: 'Open'
			}
		}
	] satisfies DataTableColumnDef<Invoice>[];

	const table = createDataTable({
		data: () => data,
		defaultColumn: {
			minSize: 64,
			maxSize: 360
		},
		columnResizeMode: 'onChange',
		enableRowSelection: true,
		enableMultiRowSelection: true,
		initialState: {
			sorting: [{ id: 'total', desc: true }]
		},
		columns
	});

	const selectedIds = $derived(table.getSelectedRowModel().rows.map((row) => row.original.id));
	const sorting = $derived(table.store.state.sorting);
	const sortingLabel = $derived(
		sorting.length > 0
			? sorting.map((sort) => `${sort.id} ${sort.desc ? 'desc' : 'asc'}`).join(', ')
			: 'None'
	);

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
		<DataTable.Toolbar>
			<DataTable.Title>Data Table</DataTable.Title>

			<div class="flex items-center gap-2">
				<DataTable.ColumnVisibility {table} />
				<Button variant="default" onclick={addInvoice}>Add invoice</Button>
			</div>
		</DataTable.Toolbar>

		<div class="h-96 min-h-0">
			<DataTable.Root {table} />
		</div>

		<div class="mt-4 space-y-3 text-sm text-ink-dim">
			<div class="flex flex-wrap items-center gap-x-6 gap-y-2">
				<div>Selected ids: {selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}</div>
				<div>Sorting: {sortingLabel}</div>
			</div>
		</div>
	</section>
</div>
