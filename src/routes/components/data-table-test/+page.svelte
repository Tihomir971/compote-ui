<script lang="ts">
	import Button from '$lib/components/button/button.svelte';
	import SimpleStressTable from './SimpleStressTable.svelte';
	import DataTableNew from '$lib/components/data-table/data-table-new.svelte';
	import * as DataTable from '$lib/components/data-table';
	let compoteRunning = $state(false); // --- SimpleStressTable + compote-ui createTable ---
	type CompoteRow = { id: number; name: string; value: number; status: string };

	const compoteDatasetA: CompoteRow[] = Array.from({ length: 14 }, (_, i) => ({
		id: i + 1,
		name: `Item ${String.fromCharCode(65 + i)}`,
		value: Math.round(1000 + i * 137.5),
		status: ['Active', 'Pending', 'Inactive'][i % 3]
	}));
	const compoteDatasetB: CompoteRow[] = Array.from({ length: 14 }, (_, i) => ({
		id: i + 1,
		name: `Item ${String.fromCharCode(65 + i)}`,
		value: Math.round(5000 - i * 213.3),
		status: ['Inactive', 'Active', 'Pending'][i % 3]
	}));
	let compoteUpdateCount = $state(0);
	let compoteData = $state<CompoteRow[]>(compoteDatasetA);
	let compoteInterval: ReturnType<typeof setInterval> | null = null;
	function toggleCompote() {
		if (compoteRunning) {
			clearInterval(compoteInterval!);
			compoteInterval = null;
			compoteRunning = false;
		} else {
			compoteRunning = true;
			compoteInterval = setInterval(() => {
				compoteData = compoteUpdateCount % 2 === 0 ? compoteDatasetB : compoteDatasetA;
				compoteUpdateCount++;
			}, 100);
		}
	}
	const compoteCol = DataTable.createDataTableColumnHelper<CompoteRow>();
	const compoteColumns = compoteCol.columns([
		compoteCol.accessor('id', { header: 'ID', size: 60 }),
		compoteCol.accessor('name', { header: 'Name' }),
		compoteCol.accessor('value', { header: 'Value', type: 'number' }),
		compoteCol.accessor('status', { header: 'Status' })
	]);
	const compoteTable = DataTable.createTable({
		get data() {
			return compoteData;
		},
		columns: compoteColumns,
		getRowId: (row) => String(row.id)
	});
</script>

<div class="max-w-2xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<div class="flex items-center gap-3">
		<h2 class="text-lg font-semibold">SimpleStressTable + compote-ui createTable</h2>
		<span class="text-sm text-ink-dim">updates: {compoteUpdateCount}</span>
	</div>
	<div class="flex gap-2">
		<Button variant={compoteRunning ? 'default' : 'outline'} onclick={toggleCompote}>
			{compoteRunning ? 'Stop (100ms interval)' : 'Start (100ms interval)'}
		</Button>
		<Button
			variant="ghost"
			onclick={() => {
				compoteUpdateCount = 0;
				compoteData = compoteDatasetA;
			}}>Reset</Button
		>
	</div>
	<SimpleStressTable table={compoteTable} />
</div>

<div class="mt-6 max-w-2xl space-y-4 rounded-xl border border-surface-3 bg-surface-1 p-4">
	<div class="flex items-center gap-3">
		<h2 class="text-lg font-semibold">DataTableNew (Step 1) + compote-ui createTable</h2>
		<span class="text-sm text-ink-dim">same table instance, same updates</span>
	</div>
	<DataTableNew table={compoteTable} class="h-80" />
</div>
