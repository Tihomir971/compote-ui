<script lang="ts">
	import { QrCode } from '$lib';
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Sizes</h2>
		<div class="flex flex-wrap items-end gap-6">
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="sm" />
				<span class="text-xs text-ink-dim">sm (80px)</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="md" />
				<span class="text-xs text-ink-dim">md (120px)</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="lg" />
				<span class="text-xs text-ink-dim">lg (160px)</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="xl" />
				<span class="text-xs text-ink-dim">xl (200px)</span>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Different Values</h2>
		<div class="flex flex-wrap items-end gap-6">
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://svelte.dev" size="md" />
				<span class="text-xs text-ink-dim">URL</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="Hello, Compote UI!" size="md" />
				<span class="text-xs text-ink-dim">Plain text</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="mailto:hello@example.com" size="md" />
				<span class="text-xs text-ink-dim">Email</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="tel:+1234567890" size="md" />
				<span class="text-xs text-ink-dim">Phone</span>
			</div>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Custom Color via Tailwind</h2>
		<div class="flex flex-wrap items-end gap-6">
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="lg" class="text-ink" />
				<span class="text-xs text-ink-dim">Default (text-ink)</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<QrCode value="https://compote-ui.dev" size="lg" class="text-primary" />
				<span class="text-xs text-ink-dim">Primary</span>
			</div>
		</div>
	</section>
</div>
