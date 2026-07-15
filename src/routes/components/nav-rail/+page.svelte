<script lang="ts">
	import { AppShell, NavRail, Button } from '$lib';
	import PhStar from '$lib/icons/PhStar.svelte';
	import PhFileText from '$lib/icons/PhFileText.svelte';
	import PhImage from '$lib/icons/PhImage.svelte';
	import PhCalendarBlank from '$lib/icons/PhCalendarBlank.svelte';
	import PhMagnifyingGlass from '$lib/icons/PhMagnifyingGlass.svelte';
	import PhUser from '$lib/icons/PhUser.svelte';

	const items = [
		{ label: 'Dashboard', icon: PhStar },
		{ label: 'Documents', icon: PhFileText },
		{ label: 'Media', icon: PhImage },
		{ label: 'Calendar', icon: PhCalendarBlank },
		{ label: 'Search', icon: PhMagnifyingGlass }
	];

	let active = $state('Dashboard');
	let expanded = $state(false);
</script>

<div class="max-w-4xl space-y-6">
	<section>
		<h2 class="mb-2 text-lg font-semibold">Icon rail, expands on hover</h2>
		<p class="mb-4 text-sm text-ink-dim">
			Collapsed to icons at <code>w-16</code>. On hover, keyboard focus, or when pinned it expands
			<em>over</em> the content — the main area never reflows. Tab into it to see it open on focus.
		</p>
		<div class="mb-4">
			<Button size="sm" variant="outline" onclick={() => (expanded = !expanded)}>
				{expanded ? 'Unpin' : 'Pin open'}
			</Button>
		</div>
		<AppShell.Root class="h-128 overflow-hidden rounded-lg border border-border">
			<AppShell.Navbar class="w-16">
				<NavRail.Root bind:expanded>
					<AppShell.Section grow class="space-y-1 p-2">
						{#each items as item (item.label)}
							{@const Icon = item.icon}
							<NavRail.Item
								label={item.label}
								active={active === item.label}
								onclick={() => (active = item.label)}
							>
								{#snippet icon()}
									<Icon />
								{/snippet}
							</NavRail.Item>
						{/each}
					</AppShell.Section>
					<AppShell.Section class="border-t border-border p-2">
						<NavRail.Item label="Profile" href="##">
							{#snippet icon()}
								<PhUser />
							{/snippet}
						</NavRail.Item>
					</AppShell.Section>
				</NavRail.Root>
			</AppShell.Navbar>
			<AppShell.Main>
				<h3 class="mb-2 font-semibold">{active}</h3>
				<p class="text-sm text-ink-dim">
					Content stays put when the rail expands. Selected item: <strong>{active}</strong>.
				</p>
			</AppShell.Main>
		</AppShell.Root>
	</section>
</div>
