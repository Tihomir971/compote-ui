<script lang="ts">
	import { Listbox } from '$lib';

	const flatItems = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana' },
		{ value: 'carrot', label: 'Carrot' },
		{ value: 'broccoli', label: 'Broccoli' },
		{ value: 'chicken', label: 'Chicken' },
		{ value: 'fish', label: 'Fish' }
	];

	const listboxItems = [
		{ value: 'apple', label: 'Apple', group: 'Fruits' },
		{ value: 'banana', label: 'Banana', group: 'Fruits' },
		{ value: 'carrot', label: 'Carrot', group: 'Vegetables' },
		{ value: 'broccoli', label: 'Broccoli', group: 'Vegetables' },
		{ value: 'chicken', label: 'Chicken', group: 'Proteins' },
		{ value: 'fish', label: 'Fish', group: 'Proteins' }
	];

	let selectedBasic = $state([flatItems[0].value]);
	let selectedFiltered = $state([flatItems[0].value]);
	let selectedGrouped = $state([listboxItems[0].value]);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic</h2>
		<div class="flex flex-col gap-4">
			<div class="h-64">
				<Listbox.Root items={flatItems} bind:value={selectedBasic}>
					<Listbox.Label>Select items</Listbox.Label>
					<Listbox.Content>
						{#snippet items({ items })}
							{#each items as item (item.value)}
								<Listbox.Item {item}>
									<Listbox.ItemText>{item.label}</Listbox.ItemText>
									<Listbox.ItemIndicator />
								</Listbox.Item>
							{/each}
						{/snippet}
					</Listbox.Content>
				</Listbox.Root>
			</div>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedBasic.join(', ')}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">With filtering</h2>
		<div class="flex flex-col gap-4">
			<div class="h-72">
				<Listbox.Root items={flatItems} bind:value={selectedFiltered}>
					<Listbox.Label>Select items (filterable)</Listbox.Label>
					<Listbox.Input placeholder="Filter..." />
					<Listbox.Content>
						{#snippet items({ items })}
							{#each items as item (item.value)}
								<Listbox.Item {item}>
									<Listbox.ItemText>{item.label}</Listbox.ItemText>
									<Listbox.ItemIndicator />
								</Listbox.Item>
							{/each}
							<Listbox.Empty>No items found.</Listbox.Empty>
						{/snippet}
					</Listbox.Content>
				</Listbox.Root>
			</div>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedFiltered.join(', ')}</strong>
			</p>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Grouped + filterable</h2>
		<div class="flex flex-col gap-4">
			<div class="h-80">
				<Listbox.Root items={listboxItems} bind:value={selectedGrouped}>
					<Listbox.Label>Select items (grouped)</Listbox.Label>
					<Listbox.Input placeholder="Filter..." />
					<Listbox.Content>
						{#snippet items({ group })}
							{#each group as [groupLabel, groupItems] (groupLabel)}
								<Listbox.ItemGroup>
									<Listbox.ItemGroupLabel>{groupLabel}</Listbox.ItemGroupLabel>
									{#each groupItems as item (item.value)}
										<Listbox.Item {item}>
											<Listbox.ItemText>{item.label}</Listbox.ItemText>
											<Listbox.ItemIndicator />
										</Listbox.Item>
									{/each}
								</Listbox.ItemGroup>
							{/each}
							<Listbox.Empty>No items found.</Listbox.Empty>
						{/snippet}
					</Listbox.Content>
				</Listbox.Root>
			</div>
			<p class="text-sm text-ink-dim">
				Selected: <strong>{selectedGrouped.join(', ')}</strong>
			</p>
		</div>
	</section>
</div>
