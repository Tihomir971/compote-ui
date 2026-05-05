<script lang="ts">
	import { useLocaleContext } from '@ark-ui/svelte/locale';
	import * as Popover from '$lib/components/popover';

	type VendorPrice = {
		vendor: string;
		price: number;
		currency: string;
	};

	type Props = {
		value: number;
		prices: VendorPrice[];
	};

	let { value, prices }: Props = $props();

	const locale = useLocaleContext();

	function formatPrice(price: number, currency = 'RSD') {
		return new Intl.NumberFormat(locale().locale, {
			style: 'currency',
			currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price);
	}

	const sortedPrices = $derived([...prices].sort((a, b) => a.price - b.price));
</script>

<Popover.Root positioning={{ placement: 'top-end' }}>
	<Popover.Trigger
		class="inline-flex cursor-pointer items-center justify-end rounded-sm text-right font-medium text-ink tabular-nums underline decoration-border decoration-dotted underline-offset-4 outline-none hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
	>
		{formatPrice(value, sortedPrices[0]?.currency)}
	</Popover.Trigger>

	<Popover.Content class="w-64 p-3" showArrow={false}>
		<div class="mb-2 text-sm font-medium text-ink">Vendor prices</div>
		<div class="space-y-1">
			{#each sortedPrices as item (item.vendor)}
				<div class="flex items-center justify-between gap-4 text-sm">
					<span class="truncate text-ink-dim">{item.vendor}</span>
					<span class="shrink-0 font-medium text-ink tabular-nums">
						{formatPrice(item.price, item.currency)}
					</span>
				</div>
			{/each}
		</div>
	</Popover.Content>
</Popover.Root>
