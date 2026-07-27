<script lang="ts">
	import { Table, Button, Checkbox } from '$lib';
	import { PhMinus, PhPlus, PhX } from '$lib/icons';

	type CartItem = { id: string; sku: string; name: string; price: number; quantity: number };

	let cartItems = $state<CartItem[]>([
		{ id: '1', sku: 'A-100', name: 'Blackcurrant preserve, 340g', price: 6.5, quantity: 2 },
		{ id: '2', sku: 'A-118', name: 'Apricot compote, 500g', price: 8.9, quantity: 1 },
		{ id: '3', sku: '', name: 'Seasonal mixed berry jar', price: 12, quantity: 4 },
		{
			id: '4',
			sku: 'B-204',
			name: 'Gift box — three jars with wooden spoon',
			price: 24.5,
			quantity: 1
		}
	]);

	const cartTotal = $derived(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

	function incrementQuantity(item: CartItem) {
		item.quantity += 1;
	}

	function decrementQuantity(item: CartItem) {
		if (item.quantity > 1) item.quantity -= 1;
	}

	function removeItem(item: CartItem) {
		cartItems = cartItems.filter((candidate) => candidate.id !== item.id);
	}

	type Rule = {
		id: string;
		warehouse_name: string;
		variant_name: string;
		level_min: number;
		level_max: number;
	};

	const conflictingRules: Rule[] = [
		{
			id: 'r1',
			warehouse_name: 'Novi Sad — Central',
			variant_name: '340g',
			level_min: 10,
			level_max: 120
		},
		{
			id: 'r2',
			warehouse_name: 'Belgrade — Dock 4',
			variant_name: '500g',
			level_min: 25,
			level_max: 300
		},
		{ id: 'r3', warehouse_name: 'Niš — Overflow', variant_name: '1kg', level_min: 0, level_max: 40 }
	];

	// Plain object rather than a Set: the prefer-svelte-reactivity lint rule
	// rejects built-in Map/Set inside .svelte files.
	let selectedIds = $state<Record<string, boolean>>({ r2: true });

	function toggleSelection(id: string) {
		selectedIds[id] = !selectedIds[id];
	}

	const specs = [
		{ label: 'Net weight', value: '340 g' },
		{ label: 'Sugar content', value: '48 g / 100 g' },
		{ label: 'Shelf life', value: '24 months, unopened' },
		{ label: 'Origin', value: 'Vojvodina, Serbia' }
	];
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-1 text-lg font-semibold">Scrolling table with sticky header and footer</h2>
		<p class="mb-4 text-sm text-ink-dim">
			Table.Root is unstyled chrome-wise — the border, rounding and scroll container belong to the
			consumer. Header and Footer are sticky by default.
		</p>
		<div class="max-h-64 overflow-auto rounded-lg border border-surface-3">
			<Table.Root class="table-fixed">
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-24">SKU</Table.Head>
						<Table.Head>Item</Table.Head>
						<Table.Head class="w-28 text-center">Quantity</Table.Head>
						<Table.Head class="w-16 text-center">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each cartItems as cartItem (cartItem.id)}
						<Table.Row>
							<Table.Cell>{cartItem.sku || '-'}</Table.Cell>
							<Table.Cell class="truncate">{cartItem.name}</Table.Cell>
							<Table.Cell class="text-center">
								<div class="flex items-center justify-center gap-2">
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Decrease quantity"
										onclick={() => decrementQuantity(cartItem)}
									>
										<PhMinus class="size-4" />
									</Button>
									<span class="w-8 text-center font-medium">{cartItem.quantity}</span>
									<Button
										variant="ghost"
										size="icon-sm"
										aria-label="Increase quantity"
										onclick={() => incrementQuantity(cartItem)}
									>
										<PhPlus class="size-4" />
									</Button>
								</div>
							</Table.Cell>
							<Table.Cell class="text-center">
								<Button
									variant="ghost"
									size="icon-sm"
									aria-label="Remove item"
									class="text-danger hover:bg-danger/10"
									onclick={() => removeItem(cartItem)}
								>
									<PhX class="size-4" />
								</Button>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.Cell colspan={2}>Total</Table.Cell>
						<Table.Cell class="text-center">{cartTotal.toFixed(2)}</Table.Cell>
						<Table.Cell></Table.Cell>
					</Table.Row>
				</Table.Footer>
			</Table.Root>
		</div>
	</section>

	<section>
		<h2 class="mb-1 text-lg font-semibold">Compact table with selection</h2>
		<p class="mb-4 text-sm text-ink-dim">
			Selection state stays with the consumer — no table instance to configure. Suits dialogs, where
			DataTable's full-height card chrome does not fit.
		</p>
		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-12">Select</Table.Head>
					<Table.Head>Warehouse</Table.Head>
					<Table.Head>Variant</Table.Head>
					<Table.Head class="text-right">Min Level</Table.Head>
					<Table.Head class="text-right">Max Level</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each conflictingRules as rule (rule.id)}
					<Table.Row selected={selectedIds[rule.id]}>
						<Table.Cell>
							<Checkbox
								checked={selectedIds[rule.id] ?? false}
								onCheckedChange={() => toggleSelection(rule.id)}
							/>
						</Table.Cell>
						<Table.Cell>{rule.warehouse_name}</Table.Cell>
						<Table.Cell>{rule.variant_name}</Table.Cell>
						<Table.Cell class="text-right">{rule.level_min}</Table.Cell>
						<Table.Cell class="text-right">{rule.level_max}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>

	<section>
		<h2 class="mb-1 text-lg font-semibold">Static spec table</h2>
		<p class="mb-4 text-sm text-ink-dim">Row headers via <code>scope="row"</code> on Table.Head.</p>
		<Table.Root class="max-w-md">
			<Table.Caption>Product specification</Table.Caption>
			<Table.Body>
				{#each specs as spec (spec.label)}
					<Table.Row>
						<Table.Head scope="row" class="w-40 bg-transparent text-ink-dim"
							>{spec.label}</Table.Head
						>
						<Table.Cell>{spec.value}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
</div>
