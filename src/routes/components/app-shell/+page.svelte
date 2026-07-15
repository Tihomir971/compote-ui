<script lang="ts">
	import { AppShell, Button } from '$lib';

	const links = Array.from({ length: 20 }, (_, i) => `Navigation item ${i + 1}`);
</script>

<div class="max-w-4xl space-y-8">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Full shell</h2>
		<p class="mb-4 text-sm text-ink-dim">
			All five regions. Header and footer span the full width; navbar and aside sit on the sides;
			main scrolls independently.
		</p>
		<AppShell.Root class="h-128 overflow-hidden rounded-lg border border-border">
			<AppShell.Header class="justify-between">
				<span class="font-semibold">Header</span>
				<Button size="sm" variant="outline">Action</Button>
			</AppShell.Header>
			<AppShell.Navbar class="p-3">
				<p class="px-2 text-xs font-medium text-ink-dim">Navbar</p>
			</AppShell.Navbar>
			<AppShell.Main>
				<h3 class="mb-2 font-semibold">Main</h3>
				<div class="space-y-3">
					{#each Array.from({ length: 30 }, (_, i) => i) as i (i)}
						<p class="text-sm text-ink-dim">Scrollable content row {i + 1}</p>
					{/each}
				</div>
			</AppShell.Main>
			<AppShell.Aside class="p-3">
				<p class="px-2 text-xs font-medium text-ink-dim">Aside</p>
			</AppShell.Aside>
			<AppShell.Footer class="text-sm text-ink-dim">Footer</AppShell.Footer>
		</AppShell.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Minimal (header + main)</h2>
		<p class="mb-4 text-sm text-ink-dim">
			Omitted regions collapse automatically — no navbar, aside or footer here, and there is no
			leftover gap.
		</p>
		<AppShell.Root class="h-64 overflow-hidden rounded-lg border border-border">
			<AppShell.Header class="font-semibold">Header</AppShell.Header>
			<AppShell.Main class="text-sm text-ink-dim">Just a header and a content area.</AppShell.Main>
		</AppShell.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Sections (pinned top &amp; bottom, scrolling middle)</h2>
		<p class="mb-4 text-sm text-ink-dim">
			<code>AppShell.Section grow</code> fills the remaining height and scrolls, while the sections above
			and below stay pinned.
		</p>
		<AppShell.Root class="h-112 overflow-hidden rounded-lg border border-border">
			<AppShell.Navbar>
				<AppShell.Section class="border-b border-border p-4 font-semibold">Logo</AppShell.Section>
				<AppShell.Section grow class="p-2">
					{#each links as link (link)}
						<a href="##" class="block rounded-md px-3 py-2 text-sm text-ink-dim hover:bg-surface-2">
							{link}
						</a>
					{/each}
				</AppShell.Section>
				<AppShell.Section class="border-t border-border p-4 text-sm text-ink-dim">
					user@example.com
				</AppShell.Section>
			</AppShell.Navbar>
			<AppShell.Main class="text-sm text-ink-dim">
				The navbar keeps its logo and footer visible while the link list scrolls.
			</AppShell.Main>
		</AppShell.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom widths</h2>
		<p class="mb-4 text-sm text-ink-dim">
			Sizing is just the <code>class</code> prop — override the default navbar/aside widths inline.
		</p>
		<AppShell.Root class="h-56 overflow-hidden rounded-lg border border-border">
			<AppShell.Navbar class="w-80 p-3 text-sm text-ink-dim">Wide navbar (w-80)</AppShell.Navbar>
			<AppShell.Main class="text-sm text-ink-dim">Main</AppShell.Main>
			<AppShell.Aside class="w-48 p-3 text-sm text-ink-dim">Narrow aside (w-48)</AppShell.Aside>
		</AppShell.Root>
	</section>
</div>
