<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import * as Popover from '../../popover';
	import * as Tooltip from '../../tooltip';
	import * as ScrollArea from '../../scroll-area';
	import Checkbox from '../../checkbox/checkbox.svelte';
	import type { DataTableInstance } from '../data-table-utils';
	import { button } from '../../button/button.variants';
	import { PhColumns } from '#lib/icons';

	type Props = {
		table: DataTableInstance<T>;
		/** Text label for the trigger. When omitted, a columns icon is shown instead. */
		triggerLabel?: string;
	};

	let { table, triggerLabel }: Props = $props();

	// Popover and tooltip share one trigger element, so both must agree on its id.
	const triggerId = $props.id();

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

<Popover.Root ids={{ trigger: triggerId }} positioning={{ placement: 'bottom-end' }}>
	<Tooltip.Root ids={{ trigger: triggerId }} disabled={!!triggerLabel}>
		<Tooltip.Trigger>
			{#snippet asChild(tooltipProps)}
				<Popover.Trigger
					{...tooltipProps()}
					aria-label={triggerLabel ? undefined : 'Columns'}
					class={button({ variant: 'outline', size: triggerLabel ? 'default' : 'icon' })}
				>
					{#if triggerLabel}
						{triggerLabel}
					{:else}
						<PhColumns />
					{/if}
				</Popover.Trigger>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>Columns</Tooltip.Content>
	</Tooltip.Root>

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
