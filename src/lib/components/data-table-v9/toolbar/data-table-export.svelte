<script lang="ts" generics="T extends RowData">
	import type { RowData } from '@tanstack/svelte-table';
	import { Menu as ArkMenu } from '@ark-ui/svelte/menu';
	import * as Menu from '../../menu';
	import * as Tooltip from '../../tooltip';
	import { button } from '../../button/button.variants';
	import { PhDownloadSimple } from '#lib/icons';
	import type { DataTableInstance } from '../data-table-utils';
	import { csvExporter } from '../export/csv-exporter';
	import { getExportData, getExportRows, type DataTableExportScope } from '../export/export-data';
	import type { DataTableExporter } from '../export/types';

	type Props = {
		table: DataTableInstance<T>;
		/** File formats to offer. One format and no selected rows: a plain button; otherwise a menu. */
		exporters?: DataTableExporter[];
		/** File name without extension. */
		filename?: string;
		/** Text label for the trigger. When omitted, a download icon is shown instead. */
		triggerLabel?: string;
	};

	let { table, exporters = [csvExporter], filename = 'export', triggerLabel }: Props = $props();

	// Menu and tooltip share one trigger element, so both must agree on its id.
	const triggerId = $props.id();

	let pending = $state(false);

	// Row model reads aren't reactive on their own: read the slices they depend on first.
	const rowSlices = $derived.by(() => [
		table.options.data,
		table.atoms.columnFilters.get(),
		table.atoms.globalFilter.get(),
		table.atoms.sorting.get(),
		table.atoms.rowSelection.get()
	]);
	const rowCount = $derived.by(() => {
		void rowSlices;
		return getExportRows(table, 'filtered').length;
	});
	// Counted exactly as the export picks them: selected rows the filter keeps.
	const selectedCount = $derived.by(() => {
		void rowSlices;
		return getExportRows(table, 'selected').length;
	});
	const hasSelection = $derived(selectedCount > 0);
	// The menu's choice, reset to all rows whenever the selection empties or starts again, so a
	// "Selected rows" pick from an earlier selection never carries over to a new one.
	let chosenScope = $derived.by<DataTableExportScope>(() => {
		void hasSelection;
		return 'filtered';
	});
	// `selected` with nothing selected would write an empty file: fall back to all rows.
	const scope = $derived<DataTableExportScope>(hasSelection ? chosenScope : 'filtered');
	const showMenu = $derived(exporters.length > 1 || hasSelection);

	async function runExport(exporter: DataTableExporter) {
		if (pending) return;
		pending = true;
		const exportScope = scope;
		try {
			await exporter.export({
				table,
				scope: exportScope,
				filename,
				getData: () => getExportData(table, exportScope)
			});
		} finally {
			pending = false;
		}
	}
</script>

{#snippet triggerContent()}
	<PhDownloadSimple />
	{triggerLabel}
{/snippet}

{#if showMenu}
	<Menu.Root ids={{ trigger: triggerId }} positioning={{ placement: 'bottom-end' }}>
		<Tooltip.Root ids={{ trigger: triggerId }} disabled={!!triggerLabel}>
			<Tooltip.Trigger>
				{#snippet asChild(tooltipProps)}
					<ArkMenu.Trigger
						{...tooltipProps()}
						aria-label={triggerLabel ? undefined : 'Export'}
						aria-busy={pending}
						class={button({ variant: 'outline', size: triggerLabel ? 'default' : 'icon' })}
					>
						{@render triggerContent()}
					</ArkMenu.Trigger>
				{/snippet}
			</Tooltip.Trigger>
			<Tooltip.Content>Export</Tooltip.Content>
		</Tooltip.Root>

		<Menu.Content class="min-w-44">
			{#if hasSelection}
				<Menu.RadioItemGroup
					value={scope}
					onValueChange={(details) => (chosenScope = details.value as DataTableExportScope)}
				>
					<Menu.RadioItem value="filtered" closeOnSelect={false}>
						All rows ({rowCount})
					</Menu.RadioItem>
					<Menu.RadioItem value="selected" closeOnSelect={false}>
						Selected rows ({selectedCount})
					</Menu.RadioItem>
				</Menu.RadioItemGroup>
				<Menu.Separator />
			{/if}
			{#each exporters as exporter (exporter.id)}
				{@const Icon = exporter.icon}
				<Menu.Item
					value={`export:${exporter.id}`}
					disabled={pending}
					onSelect={() => runExport(exporter)}
				>
					{#if Icon}<Icon class="text-ink-dim" />{/if}
					{exporter.label}
				</Menu.Item>
			{/each}
		</Menu.Content>
	</Menu.Root>
{:else}
	{@const exporter = exporters[0]}
	{#if exporter}
		<Tooltip.Root disabled={!!triggerLabel}>
			<!-- aria-disabled instead of disabled so keyboard focus isn't lost mid-export -->
			<Tooltip.Trigger
				type="button"
				variant="outline"
				size={triggerLabel ? 'default' : 'icon'}
				class="aria-disabled:cursor-default"
				aria-label={triggerLabel ? undefined : `Export ${exporter.label}`}
				aria-busy={pending}
				aria-disabled={pending}
				onclick={() => runExport(exporter)}
			>
				{@render triggerContent()}
			</Tooltip.Trigger>
			<Tooltip.Content>Export {exporter.label}</Tooltip.Content>
		</Tooltip.Root>
	{/if}
{/if}
