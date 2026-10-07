<script lang="ts">
	import { Button, DatePicker, NumberInput, Popover } from '#lib';

	let date = $state<string | null>(null);
	let amount = $state<number | null>(null);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic Popover</h2>
		<Popover.Root>
			<Popover.Trigger>
				<Button>Open Popover</Button>
			</Popover.Trigger>
			<Popover.Content>
				<Popover.Title>Popover Title</Popover.Title>
				<Popover.Description class="mt-1 text-sm text-ink-dim">
					This is a basic popover with a title, description, and close button.
				</Popover.Description>
				<Popover.CloseTrigger />
			</Popover.Content>
		</Popover.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">No Arrow</h2>
		<Popover.Root>
			<Popover.Trigger>
				<Button variant="outline">Open (No Arrow)</Button>
			</Popover.Trigger>
			<Popover.Content showArrow={false}>
				<Popover.Title>No Arrow Popover</Popover.Title>
				<Popover.Description class="mt-1 text-sm text-ink-dim">
					This popover renders without the arrow indicator.
				</Popover.Description>
				<Popover.CloseTrigger />
			</Popover.Content>
		</Popover.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom Positioning</h2>
		<Popover.Root positioning={{ placement: 'right' }}>
			<Popover.Trigger>
				<Button variant="outline">Open Right</Button>
			</Popover.Trigger>
			<Popover.Content>
				<Popover.Title>Right-Aligned Popover</Popover.Title>
				<Popover.Description class="mt-1 text-sm text-ink-dim">
					This popover is positioned to the right of its trigger using the positioning prop.
				</Popover.Description>
				<Popover.CloseTrigger />
			</Popover.Content>
		</Popover.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Form Fields Inside</h2>
		<p class="mb-3 text-sm text-ink-dim">
			Focus a field, type, then press Escape. The content unmounts while the field still has focus,
			so its blur commit runs during teardown.
		</p>
		<Popover.Root>
			<Popover.Trigger>
				<Button variant="outline">Open Form</Button>
			</Popover.Trigger>
			<Popover.Content>
				<div class="flex flex-col gap-3">
					<DatePicker label="Date" bind:value={date} />
					<NumberInput label="Amount" bind:value={amount} />
				</div>
			</Popover.Content>
		</Popover.Root>
		<p class="mt-3 text-sm text-ink-dim">
			Date: <strong>{date ?? 'none'}</strong> · Amount: <strong>{amount ?? 'none'}</strong>
		</p>
	</section>
</div>
