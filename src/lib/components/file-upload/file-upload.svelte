<script lang="ts">
	import { FileUpload, type FileUploadFileError } from '@ark-ui/svelte/file-upload';
	import { PhX } from '$lib/icons';
	import type { FileUploadProps } from './types';
	import { getAcceptAttribute } from './utils';
	import { getFileIcon } from './icons';

	const errorMessages: Record<FileUploadFileError, string> = {
		TOO_MANY_FILES: 'Too many files',
		FILE_INVALID_TYPE: 'Invalid file type',
		FILE_TOO_LARGE: 'File too large',
		FILE_TOO_SMALL: 'File too small',
		FILE_INVALID: 'Invalid file',
		FILE_EXISTS: 'File already exists'
	};

	let {
		fileType,
		label,
		triggerLabel = 'Choose file',
		maxFiles = 1,
		...restProps
	}: FileUploadProps = $props();

	const accept = $derived(getAcceptAttribute(fileType));
</script>

<FileUpload.Root {maxFiles} {accept} class="flex flex-col gap-1.5" {...restProps}>
	{#if label}
		<FileUpload.Label class="text-sm font-medium">{label}</FileUpload.Label>
	{/if}

	<FileUpload.Context>
		{#snippet render(context)}
			{@const ctx = context()}
			{@const accepted = ctx.acceptedFiles}
			{@const rejected = ctx.rejectedFiles}

			{#if maxFiles === 1}
				{#if accepted.length === 0}
					<FileUpload.Trigger
						class="inline-flex h-9 cursor-pointer items-center gap-2 rounded border px-3 text-sm text-ink transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{triggerLabel}
					</FileUpload.Trigger>
				{/if}
			{:else}
				<FileUpload.Trigger
					disabled={accepted.length >= maxFiles}
					class="inline-flex h-9 cursor-pointer items-center gap-2 rounded border px-3 text-sm text-ink transition-colors hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50"
				>
					{triggerLabel}
				</FileUpload.Trigger>
			{/if}

			<FileUpload.ItemGroup class="flex flex-col gap-1">
				{#each accepted as file (file.name)}
					<FileUpload.Item {file} class="flex items-center gap-2 rounded border px-3 py-2 text-sm">
						<FileUpload.ItemPreview type="image/*">
							<FileUpload.ItemPreviewImage class="size-8 shrink-0 rounded object-cover" />
						</FileUpload.ItemPreview>
						{#if !file.type.startsWith('image/')}
							{@const Icon = getFileIcon(file)}
							<Icon class="size-4 shrink-0" />
						{/if}
						<FileUpload.ItemName class="flex-1 truncate" />
						<FileUpload.ItemSizeText class="shrink-0 text-xs text-ink-dim" />
						<FileUpload.ItemDeleteTrigger
							class="ml-auto shrink-0 cursor-pointer text-ink-dim transition-colors hover:text-ink"
						>
							<PhX class="size-4" />
						</FileUpload.ItemDeleteTrigger>
					</FileUpload.Item>
				{/each}
			</FileUpload.ItemGroup>

			{#if rejected.length > 0}
				<div class="mt-1 flex flex-col gap-0.5">
					{#each rejected as rejection (rejection.file.name)}
						<p class="text-xs text-red-600">
							{rejection.file.name}: {rejection.errors.map((e) => errorMessages[e]).join(', ')}
						</p>
					{/each}
				</div>
			{/if}
		{/snippet}
	</FileUpload.Context>

	<FileUpload.HiddenInput />
</FileUpload.Root>
