<script lang="ts">
	import { Avatar } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Sizes</h2>
		<div class="flex items-center gap-4">
			<Avatar src="https://i.pravatar.cc/300?u=compote" alt="User avatar" size="sm" />
			<Avatar src="https://i.pravatar.cc/300?u=compote" alt="User avatar" size="md" />
			<Avatar src="https://i.pravatar.cc/300?u=compote" alt="User avatar" size="lg" />
			<Avatar src="https://i.pravatar.cc/300?u=compote" alt="User avatar" size="xl" />
		</div>
		<p class="mt-2 text-sm text-ink-dim">sm / md / lg / xl</p>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Fallback (initials)</h2>
		<div class="flex items-center gap-4">
			<Avatar fallback="John Doe" size="sm" />
			<Avatar fallback="Anna Brown" size="md" />
			<Avatar fallback="Tom Clark" size="lg" />
			<Avatar fallback="Xavier Young" size="xl" />
		</div>
		<p class="mt-2 text-sm text-ink-dim">No src — shows initials fallback</p>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Broken image src (fallback)</h2>
		<div class="flex items-center gap-4">
			<Avatar src="https://broken.url/image.png" fallback="Jane Doe" alt="Jane Doe" size="sm" />
			<Avatar src="https://broken.url/image.png" fallback="Anna Brown" alt="Anna Brown" size="md" />
			<Avatar src="https://broken.url/image.png" fallback="Tom Clark" alt="Tom Clark" size="lg" />
			<Avatar src="https://broken.url/image.png" fallback="Xavier Young" alt="Xavier Young" size="xl" />
		</div>
		<p class="mt-2 text-sm text-ink-dim">Broken src — Ark UI detects load failure, shows fallback</p>
	</section>
</div>
