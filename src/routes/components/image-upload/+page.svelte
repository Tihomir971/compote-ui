<script lang="ts">
	import { ImageUpload } from '$lib';

	let avatarValue = $state<string | undefined>(undefined);
	let bannerValue = $state<string | undefined>(undefined);
</script>

<div class="max-w-4xl space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Circle (avatar-style)</h2>
		<ImageUpload bind:value={avatarValue} aspectRatio={1} alt="Profile photo" />
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Square, 16:9</h2>
		<ImageUpload
			bind:value={bannerValue}
			shape="square"
			class="aspect-video w-64"
			aspectRatio={16 / 9}
			alt="Banner image"
			uploadLabel="Upload banner"
		/>
	</section>
</div>
