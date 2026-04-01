<script lang="ts">
	import { FileUpload } from '@ark-ui/svelte/file-upload';
	import { getFileIcon } from './icons';
	import PhFileText from '$lib/icons/PhFileText.svelte';
	import PhX from '$lib/icons/PhX.svelte';

	const defaultFiles = [
		new File(['Welcome to Ark UI Svelte`'], 'document.pdf', {
			type: 'text/plain'
		}),
		new File(['Welcome to Ark UI Svelte, this is a zip file`'], 'showcase.zip', {
			type: 'application/zip'
		}),
		new File(['Welcome to Ark UI Svelte, this is an excel file`'], 'data.xlsx', {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		})
	];
</script>

<FileUpload.Root
	maxFiles={10}
	maxFileSize={100 * 1024 * 1024}
	class="w-full max-w-2xl space-y-4"
	defaultAcceptedFiles={defaultFiles}
>
	<FileUpload.Context>
		{#snippet render(context)}
			<!-- Dropzone -->
			<FileUpload.Dropzone
				class="flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-3 bg-surface-2 px-6 py-12 transition-colors hover:bg-surface-3"
			>
				<!-- File Icon -->
				<div
					class="mb-4 flex h-12 w-12 items-center justify-center rounded-full border bg-surface-1"
				>
					<PhFileText class="h-5 w-5 text-ink-dim" />
				</div>

				<!-- Text -->
				<div class="space-y-2 text-center">
					<h3 class="text-sm font-medium text-ink">Upload files</h3>
					<p class="text-sm text-ink-dim">Drag & drop or click to browse</p>
					<p class="text-xs text-ink-dim">All files • Max 10 files • Up to 100MB</p>
				</div>
			</FileUpload.Dropzone>

			<!-- Files List -->
			{#if context().acceptedFiles.length > 0}
				<div class="space-y-3">
					<FileUpload.ItemGroup>
						{#each context().acceptedFiles as file (file.name)}
							<FileUpload.Item {file}>
								<div class="flex items-center gap-3 rounded-lg border bg-surface-1 p-3">
									<!-- File Icon/Preview -->
									<div
										class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-surface-2"
									>
										{#if file.type.startsWith('image/')}
											<FileUpload.ItemPreview type="image/*">
												<FileUpload.ItemPreviewImage class="h-full w-full object-cover" />
											</FileUpload.ItemPreview>
										{:else}
											{@const IconComponent = getFileIcon(file)}
											<IconComponent class="h-4 w-4 opacity-60" />
										{/if}
									</div>

									<!-- File Info -->
									<div class="min-w-0 flex-1">
										<FileUpload.ItemName class="truncate text-sm font-medium text-ink" />
										<FileUpload.ItemSizeText class="text-xs text-ink-dim" />
									</div>

									<!-- Delete Button -->
									<FileUpload.ItemDeleteTrigger
										class="flex h-6 w-6 shrink-0 items-center justify-center text-ink-dim hover:text-ink"
									>
										<PhX class="h-4 w-4" />
									</FileUpload.ItemDeleteTrigger>
								</div>
							</FileUpload.Item>
						{/each}
					</FileUpload.ItemGroup>

					<!-- Remove All Button -->
					<FileUpload.ClearTrigger
						class="inline-flex items-center rounded-md border bg-surface-1 px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-hidden"
					>
						Remove all files
					</FileUpload.ClearTrigger>
				</div>
			{/if}
		{/snippet}
	</FileUpload.Context>

	<FileUpload.HiddenInput />
</FileUpload.Root>
