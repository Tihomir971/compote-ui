<script lang="ts">
	import { ScrollArea } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Vertical</h2>
		<ScrollArea.Root class="h-48 w-72">
			<ScrollArea.Viewport>
				<ScrollArea.Content class="p-4">
					<p class="text-sm leading-relaxed text-ink-dim">
						Ark UI is a headless component library for building accessible, high-quality UI
						components for React, Solid, Vue, and Svelte. It provides unstyled, fully accessible
						components that you can customize to match your design system. Built on top of Zag.js
						state machines, Ark UI ensures consistent behavior across all frameworks while giving
						you complete control over styling. Whether you need a simple button or a complex data
						table, Ark UI has you covered with a comprehensive set of components that are both
						flexible and accessible. The library follows WAI-ARIA patterns and supports keyboard
						navigation out of the box.
					</p>
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="vertical">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Horizontal</h2>
		<ScrollArea.Root class="h-16 w-72">
			<ScrollArea.Viewport>
				<ScrollArea.Content class="p-4">
					<p class="w-150 text-sm whitespace-nowrap text-ink-dim">
						This is a very long line of text that requires horizontal scrolling to read in its
						entirety. Keep scrolling to the right to see more content.
					</p>
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar orientation="horizontal">
				<ScrollArea.Thumb />
			</ScrollArea.Scrollbar>
			<ScrollArea.Corner />
		</ScrollArea.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Filter Sidebar</h2>
		<div class="flex gap-6">
			<ScrollArea.Root class="h-80 w-56 shrink-0 rounded-lg border border-border bg-surface-2">
				<ScrollArea.Viewport>
					<ScrollArea.Content class="p-3">
						<div class="space-y-5">
							<div>
								<p class="mb-2 text-xs font-semibold tracking-wide text-ink-dim uppercase">
									Categories
								</p>
								<ul class="space-y-1">
									{#each ['All', 'Clothing', 'Shoes', 'Accessories', 'Bags', 'Watches', 'Jewelry', 'Sunglasses'] as category (category)}
										<li>
											<label
												class="flex cursor-pointer items-center gap-2 text-sm hover:text-primary"
											>
												<input type="checkbox" class="accent-primary" />
												{category}
											</label>
										</li>
									{/each}
								</ul>
							</div>
							<div>
								<p class="mb-2 text-xs font-semibold tracking-wide text-ink-dim uppercase">
									Brands
								</p>
								<ul class="space-y-1">
									{#each ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Under Armour', 'Converse', 'Vans'] as brand (brand)}
										<li>
											<label
												class="flex cursor-pointer items-center gap-2 text-sm hover:text-primary"
											>
												<input type="checkbox" class="accent-primary" />
												{brand}
											</label>
										</li>
									{/each}
								</ul>
							</div>
							<div>
								<p class="mb-2 text-xs font-semibold tracking-wide text-ink-dim uppercase">Size</p>
								<ul class="space-y-1">
									{#each ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as size (size)}
										<li>
											<label
												class="flex cursor-pointer items-center gap-2 text-sm hover:text-primary"
											>
												<input type="checkbox" class="accent-primary" />
												{size}
											</label>
										</li>
									{/each}
								</ul>
							</div>
						</div>
					</ScrollArea.Content>
				</ScrollArea.Viewport>
				<ScrollArea.Scrollbar orientation="vertical">
					<ScrollArea.Thumb />
				</ScrollArea.Scrollbar>
				<ScrollArea.Corner />
			</ScrollArea.Root>

			<div class="flex-1 text-sm text-ink-dim">
				← Scroll the sidebar to browse all filter options
			</div>
		</div>
	</section>
</div>
