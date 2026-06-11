<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import * as Popover from '../../popover';
	import * as ScrollArea from '../../scroll-area';
	import Checkbox from '../../checkbox/checkbox.svelte';
	import type { DataTableInstance } from '../data-table-utils';

	type Props = {
		table: DataTableInstance<T>;
		triggerLabel?: string;
	};

	let { table, triggerLabel = 'Columns' }: Props = $props();

	const columnVisibility = $derived.by(() => table.atoms.columnVisibility.get());
	const allLeafColumns = $derived.by(() => {
		void columnVisibility;
		return table.getAllLeafColumns();
	});
	const allColumnsVisible = $derived(
		allLeafColumns.every((c) => !c.getCanHide() || columnVisibility[c.id] !== false)
	);
	const someColumnsVisible = $derived(
		allLeafColumns.some((c) => c.getCanHide() && columnVisibility[c.id] !== false)
	);
	const allColumnsVisibilityState = $derived(
		allColumnsVisible ? true : someColumnsVisible ? ('indeterminate' as const) : false
	);

	function getColumnLabel(column: { columnDef: { header?: unknown }; id: string }) {
		return typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
	}
</script>

<Popover.Root positioning={{ placement: 'bottom-end' }}>
	<Popover.Trigger
		class="flex h-9 cursor-pointer items-center rounded-md border border-surface-3 bg-surface-1 px-3 text-sm font-medium text-ink shadow-sm outline-none hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
	>
		{triggerLabel}
	</Popover.Trigger>

	<Popover.Content class="w-56 p-2" showArrow={false}>
		<div class="border-b border-surface-3 px-2 pb-2">
			<Checkbox
				label="All columns"
				checked={allColumnsVisibilityState}
				onCheckedChange={({ checked }) => table.toggleAllColumnsVisible(checked === true)}
			/>
		</div>

		<ScrollArea.Root class="h-72">
			<ScrollArea.Viewport>
				<ScrollArea.Content class="py-1 pe-3">
					<div class="flex flex-col">
						{#each allLeafColumns as column (column.id)}
							<Checkbox
								label={getColumnLabel(column)}
								class="min-h-8 rounded-sm px-2 hover:bg-surface-2"
								checked={columnVisibility[column.id] !== false}
								disabled={!column.getCanHide()}
								onCheckedChange={({ checked }) => column.toggleVisibility(checked === true)}
							/>
						{/each}
					</div>
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="vertical">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</Popover.Content>
</Popover.Root>
