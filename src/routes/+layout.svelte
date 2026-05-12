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
	<div class="grid h-screen grid-cols-[14rem_1fr]">
		<!-- Sidebar -->
		<aside class="border-r border-border bg-surface-1">
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
		<main class="min-w-0 overflow-x-hidden overflow-y-auto p-8 *:mx-auto">
			{@render children()}
		</main>
	</div>
</LocaleProvider>
