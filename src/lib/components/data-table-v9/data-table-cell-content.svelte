<script lang="ts" generics="T extends RowData">
	import type { Cell, RowData } from '@tanstack/svelte-table';
	import { FlexRender } from '@tanstack/svelte-table';
	import { cn } from 'tailwind-variants';
	import { PhArrowSquareOut, PhCheck, PhPhone, PhX } from '$lib/icons';
	import type { DataTableFeatures } from './features';
	import {
		getBooleanCellValue,
		getColumnMeta,
		getPhoneCellValue,
		getUrlCellValue,
		justifyClass,
		openPhoneCell,
		openUrlCell
	} from './data-table-utils';
	import { formatPhoneCellValue } from './phone-format';

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
{:else if meta?.type === 'phone'}
	{@const value = getPhoneCellValue(cell.getValue())}
	{#if value}
		<span class={cn('inline-flex max-w-full items-center gap-1.5', justifyClass(meta.align))}>
			<button
				type="button"
				class="inline-flex shrink-0 appearance-none rounded-sm border-0 bg-transparent p-0 text-ink-dim outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
				aria-label="Call {value}"
				onclick={(event) => {
					event.stopPropagation();
					openPhoneCell(value);
				}}
			>
				<PhPhone class="size-3.5" />
			</button>
			<span class="truncate leading-5">{formatPhoneCellValue(value)}</span>
		</span>
	{:else}
		-
	{/if}
{:else}
	<FlexRender {cell} />
{/if}
