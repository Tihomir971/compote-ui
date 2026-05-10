<script lang="ts">
	import { Collapsible } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic</h2>
		<Collapsible.Root class="max-w-sm">
			<Collapsible.Trigger>
				What is Ark UI?
				<Collapsible.Indicator />
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p class="px-3 py-2.5 leading-relaxed">
					Ark UI is a headless component library for building accessible, high-quality UI components
					for React, Solid, Vue, and Svelte.
				</p>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Default Open</h2>
		<Collapsible.Root class="max-w-sm" defaultOpen>
			<Collapsible.Trigger>
				System Requirements
				<Collapsible.Indicator />
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p class="px-3 py-2.5 leading-relaxed">
					Requires Node.js 18+, a modern browser, and Svelte 5.
				</p>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<Collapsible.Root class="max-w-sm" disabled>
			<Collapsible.Trigger>
				Unavailable Section
				<Collapsible.Indicator />
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p class="px-3 py-2.5 leading-relaxed">This content is not accessible.</p>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Partial Collapse</h2>
		<Collapsible.Root class="max-w-sm" collapsedHeight="60px">
			<Collapsible.Trigger>
				Read More
				<Collapsible.Indicator />
			</Collapsible.Trigger>
			<Collapsible.Content>
				<p class="px-3 py-2.5 leading-relaxed">
					Ark UI is a headless component library for building accessible, high-quality UI components
					for React, Solid, Vue, and Svelte. It provides unstyled, fully accessible components that
					you can customize to match your design system.
				</p>
				<p class="px-3 pb-2.5 leading-relaxed">
					Built on top of Zag.js state machines, Ark UI ensures consistent behavior across all
					frameworks while giving you complete control over styling.
				</p>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Nested</h2>
		<Collapsible.Root class="max-w-sm">
			<Collapsible.Trigger>
				Frontend
				<Collapsible.Indicator />
			</Collapsible.Trigger>
			<Collapsible.Content>
				<div class="px-3 py-2.5">
					<Collapsible.Root>
						<Collapsible.Trigger>
							Svelte
							<Collapsible.Indicator />
						</Collapsible.Trigger>
						<Collapsible.Content>
							<p class="px-3 py-2.5 leading-relaxed text-ink-dim">
								Svelte 5 with runes-based reactivity.
							</p>
						</Collapsible.Content>
					</Collapsible.Root>
					<Collapsible.Root class="mt-2">
						<Collapsible.Trigger>
							React
							<Collapsible.Indicator />
						</Collapsible.Trigger>
						<Collapsible.Content>
							<p class="px-3 py-2.5 leading-relaxed text-ink-dim">
								React 19 with server components support.
							</p>
						</Collapsible.Content>
					</Collapsible.Root>
				</div>
			</Collapsible.Content>
		</Collapsible.Root>
	</section>
</div>
