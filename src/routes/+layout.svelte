<script lang="ts">
	import { LocaleProvider } from '@ark-ui/svelte/locale';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { navItems } from './nav-items';
	import { ScrollArea } from '$lib';
	import './layout.css';
	// Supports weights 200-900
	import '@fontsource-variable/nunito-sans/wght.css';

	const { children } = $props();

	// resolve() is overloaded for literal pathnames; we cast since slugs come from nav-items
	const resolvePath = (slug: string) => resolve(`/components/${slug}` as '/components/button');

	const currentSlug = $derived(
		page.url.pathname.split('/components/')[1]?.replace(/\/$/, '') ?? ''
	);
</script>

<LocaleProvider locale="sr-Latn-RS">
	<div class="flex h-screen">
		<!-- Sidebar -->
		<aside class="w-56 shrink-0 border-r border-border bg-surface-1">
			<div class="border-b border-border px-4 py-3">
				<h1 class="text-sm font-semibold text-ink">Compote UI</h1>
			</div>
			<ScrollArea.Root class="h-[calc(100vh-3.25rem)]">
				<ScrollArea.Viewport>
					<ScrollArea.Content>
						<nav class="p-2">
							{#each navItems as item (item.slug)}
								<a
									href={resolvePath(item.slug)}
									class="block rounded-md px-3 py-1.5 text-sm transition-colors {currentSlug ===
									item.slug
										? 'bg-primary/10 font-medium text-primary'
										: 'text-ink-dim hover:bg-surface-2 hover:text-ink'}"
								>
									{item.label}
								</a>
							{/each}
						</nav>
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical">
					<ScrollArea.Thumb />
				</ScrollArea.Scrollbar>
			</ScrollArea.Root>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-y-auto">
			<div class="mx-auto max-w-4xl p-8">
				{@render children()}
			</div>
		</main>
	</div>
</LocaleProvider>
