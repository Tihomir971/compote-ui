<script lang="ts">
	import PhUser from '$lib/icons/PhUser.svelte';
	import { FileUpload } from '@ark-ui/svelte/file-upload';
</script>

<FileUpload.Root maxFiles={1} accept="image/*" class="flex flex-col items-start gap-3">
	<FileUpload.Context>
		{#snippet render(context)}
			<div class="flex items-center gap-3">
				<!-- Image Preview / Placeholder -->
				<div
					class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border bg-surface-2"
				>
					{#if context().acceptedFiles.length > 0}
						<FileUpload.ItemGroup>
							<FileUpload.Item file={context().acceptedFiles[0]}>
								<FileUpload.ItemPreview type="image/*">
									<FileUpload.ItemPreviewImage class="h-full w-full object-cover" />
								</FileUpload.ItemPreview>
							</FileUpload.Item>
						</FileUpload.ItemGroup>
					{:else}
						<PhUser class="h-5 w-5 text-ink-dim" />
					{/if}
				</div>

				<!-- Upload/Change Button -->
				<FileUpload.Trigger
					class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden"
				>
					{context().acceptedFiles.length > 0 ? 'Change image' : 'Upload image'}
				</FileUpload.Trigger>
			</div>

			<!-- Filename and Remove -->
			{#if context().acceptedFiles.length > 0}
				<FileUpload.ItemGroup>
					<FileUpload.Item file={context().acceptedFiles[0]} class="flex items-center gap-2">
						<FileUpload.ItemName class="text-sm text-ink-dim" />
						<FileUpload.ItemDeleteTrigger class="text-sm text-red-500 hover:text-red-600">
							Remove
						</FileUpload.ItemDeleteTrigger>
					</FileUpload.Item>
				</FileUpload.ItemGroup>
			{/if}
		{/snippet}
	</FileUpload.Context>

	<FileUpload.HiddenInput />
</FileUpload.Root>
