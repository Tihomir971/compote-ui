<script lang="ts">
	import { Button, Popover } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
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
</div>
