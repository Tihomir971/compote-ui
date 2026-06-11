<script lang="ts" generics="T extends RowData">
	import type { Cell, RowData } from '@tanstack/svelte-table';
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhX } from '$lib/icons';
	import type { DataTableFeatures } from './features';
	import {
		getBooleanCellValue,
		getColumnMeta,
		getUrlCellValue,
		justifyClass,
		openUrlCell
	} from './data-table-utils';

	type Props = {
		cell: Cell<DataTableFeatures, T, unknown>;
	};

	let { cell }: Props = $props();

	const meta = $derived(getColumnMeta(cell.column.columnDef));
</script>

{#if meta?.type === 'boolean'}
	{@const value = getBooleanCellValue(cell.getValue())}
	{#if value === true}
		<span
			class="inline-flex size-5 items-center justify-center text-success"
			role="img"
			aria-label="Yes"
		>
			<PhCheck class="size-4" />
		</span>
	{:else if value === false}
		<span
			class="inline-flex size-5 items-center justify-center text-danger"
			role="img"
			aria-label="No"
		>
			<PhX class="size-4" />
		</span>
	{:else}
		-
	{/if}
{:else if meta?.type === 'url'}
	{@const value = getUrlCellValue(cell.getValue())}
	{#if value}
		<button
			type="button"
			class={cn(
				'inline-flex max-w-full appearance-none items-center gap-1.5 rounded-sm border-0 bg-transparent p-0 align-middle leading-5 font-medium text-ink underline decoration-border decoration-dotted underline-offset-4 outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
				justifyClass(meta.align)
			)}
			onclick={(event) => {
				event.stopPropagation();
				openUrlCell(value);
			}}
		>
			<PhArrowSquareOut class="size-3.5 shrink-0" />
		</button>
	{:else}
		-
	{/if}
{:else}
	<FlexRender {cell} />
{/if}
