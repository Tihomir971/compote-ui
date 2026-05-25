<script lang="ts">
	import { JsonTreeView, ScrollArea } from '$lib';

	const profile = {
		name: 'Ada Lovelace',
		active: true,
		email: 'ada@example.com',
		stats: {
			projects: 12,
			score: 98.7,
			lastSeen: new Date('2026-05-21T09:30:00Z')
		},
		tags: ['compiler', 'notes', 'analysis'],
		preferences: {
			theme: 'system',
			notifications: null
		}
	};

	const apiResponse = {
		status: 200,
		ok: true,
		requestId: 'req_8f31ca',
		user: {
			id: 'usr_123',
			email: 'marie@example.com',
			roles: ['admin', 'editor']
		},
		errors: [],
		meta: {
			cache: 'hit',
			durationMs: 34
		}
	};

	const isEmail = (value: string) => {
		const unquoted = value.replace(/^"(.*)"$/, '$1');

		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(unquoted);
	};
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Json Tree View</h2>
		<ScrollArea.Root class="h-96 rounded-lg border border-surface-3 bg-surface-document">
			<ScrollArea.Viewport>
				<ScrollArea.Content class="p-2">
					<JsonTreeView data={profile} defaultExpandedDepth={2} />
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="vertical">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Scrollbar orientation="horizontal">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom Value Rendering</h2>
		<ScrollArea.Root class="h-96 rounded-lg border border-surface-3 bg-surface-document">
			<ScrollArea.Viewport>
				<ScrollArea.Content class="p-2">
					<JsonTreeView data={apiResponse} defaultExpandedDepth={3}>
						{#snippet renderValue(node)}
							{#if node.type === 'text' && typeof node.value === 'string' && isEmail(node.value)}
								<a
									class="underline decoration-primary/50 underline-offset-2 hover:text-primary"
									href={`mailto:${node.value.replace(/^"(.*)"$/, '$1')}`}
								>
									{node.value}
								</a>
							{:else if node.type === 'text'}
								{node.value}
							{/if}
						{/snippet}
					</JsonTreeView>
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="vertical">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Scrollbar orientation="horizontal">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</section>
</div>
