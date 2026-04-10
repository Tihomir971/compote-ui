<script lang="ts">
	import { Card, Button } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic Card</h2>
		<Card.Root class="max-w-sm">
			<Card.Header>
				<Card.Title>Card Title</Card.Title>
				<Card.Description>Card Description</Card.Description>
			</Card.Header>
			<Card.Content>
				<p>This is the card content area. You can put any content here.</p>
			</Card.Content>
			<Card.Footer>
				<p class="text-sm text-ink-dim">Card Footer</p>
			</Card.Footer>
		</Card.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Card with Actions</h2>
		<Card.Root class="max-w-sm">
			<Card.Header>
				<Card.Title>Notifications</Card.Title>
				<Card.Description>You have 3 unread messages.</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="space-y-2">
					<div class="flex items-center gap-3 rounded-lg border border-border p-3">
						<div class="size-2 rounded-full bg-primary"></div>
						<p class="text-sm">Your subscription is expiring soon.</p>
					</div>
					<div class="flex items-center gap-3 rounded-lg border border-border p-3">
						<div class="size-2 rounded-full bg-primary"></div>
						<p class="text-sm">New comment on your post.</p>
					</div>
					<div class="flex items-center gap-3 rounded-lg border border-border p-3">
						<div class="size-2 rounded-full bg-primary"></div>
						<p class="text-sm">You have a new follower.</p>
					</div>
				</div>
			</Card.Content>
			<Card.Footer class="gap-2">
				<Button variant="outline" size="sm" class="w-full">Dismiss all</Button>
				<Button size="sm" class="w-full">View all</Button>
			</Card.Footer>
		</Card.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Cards Grid</h2>
		<div class="grid grid-cols-3 gap-4">
			{#each ['Design', 'Engineering', 'Marketing'] as team (team)}
				<Card.Root>
					<Card.Header>
						<Card.Title>{team}</Card.Title>
						<Card.Description>Team overview</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-2xl font-bold">12</p>
						<p class="text-sm text-ink-dim">members</p>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</section>
</div>
