<script lang="ts">
	import * as DataTableNew from '$lib/components/data-table-new';
	import type { DataTableColumn } from '$lib/components/data-table-new';

	type Invoice = {
		id: string;
		customer: string;
		status: 'Paid' | 'Pending' | 'Overdue';
		items: number;
		total: number;
		owner: string;
	};

	let invoices = $state<Invoice[]>([
		{
			id: 'INV-1001',
			customer: 'Acme Co.',
			status: 'Paid',
			items: 12,
			total: 1240.34,
			owner: 'Mila'
		},
		{
			id: 'INV-1002',
			customer: 'Northwind',
			status: 'Pending',
			items: 4,
			total: 860.75,
			owner: 'Petar'
		},
		{
			id: 'INV-1003',
			customer: 'Globex',
			status: 'Overdue',
			items: 18,
			total: 1425.32,
			owner: 'Ana'
		},
		{
			id: 'INV-1004',
			customer: 'Umbrella',
			status: 'Paid',
			items: 2,
			total: 312.3,
			owner: 'Marko'
		}
	]);

	const currency = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD'
	});

	const columns: DataTableColumn<Invoice>[] = [
		{
			header: 'Invoice',
			accessorKey: 'id'
		},
		{
			header: 'Customer',
			accessorKey: 'customer'
		},
		{
			header: 'Status',
			accessorKey: 'status'
		},
		{
			header: 'Items',
			accessorKey: 'items',
			align: 'right'
		},
		{
			header: 'Total',
			accessorKey: 'total',
			align: 'right',
			cell: (value) => currency.format(Number(value))
		},
		{
			header: 'Owner',
			accessorKey: 'owner'
		}
	];

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
				owner: 'Natasha'
			}
		];
	}

	function updateColumnSize(columnId: string, size: number) {
		table.setColumnSizing({
			...table.store.state.columnSizing,
			[columnId]: size
		});
	}

	function getSelectedRowCount(rowSelection: unknown) {
		void rowSelection;
		return table.getSelectedRowModel().rows.length;
	}

	const selectedRowCount = $derived(getSelectedRowCount(table.store.state.rowSelection));
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section class="space-y-4">
		<DataTableNew.Toolbar>
			<DataTableNew.Title>Data Table New</DataTableNew.Title>
			<DataTableNew.ColumnVisibility {table} />
		</DataTableNew.Toolbar>

		<div class="flex flex-wrap gap-2">
			<button
				class="w-fit rounded-md border border-border bg-surface-2 px-3 py-2 text-sm font-medium text-ink hover:bg-well"
				onclick={addInvoice}
			>
				Add invoice
			</button>
			<div
				class="flex items-center rounded-md border border-border bg-surface-2 px-3 py-2 text-sm text-ink-dim"
			>
				{selectedRowCount} selected
			</div>
		</div>

		<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
			{#each table.getAllColumns() as column (column.id)}
				<label class="grid gap-1 text-sm text-ink-dim">
					<span class="font-medium text-ink">{column.id}</span>
					<input
						class="h-9 rounded-md border border-border bg-surface-2 px-2 text-sm text-ink"
						min="40"
						type="number"
						value={column.getSize()}
						oninput={(event) => updateColumnSize(column.id, Number(event.currentTarget.value))}
					/>
				</label>
			{/each}
		</div>

		<div class="h-96 min-h-0 max-w-3xl">
			<DataTableNew.Root {table} {columns} caption="Invoices" />
		</div>
	</section>
</div>
