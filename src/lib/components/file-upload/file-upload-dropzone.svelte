<script lang="ts">
	import { FileUpload } from '@ark-ui/svelte/file-upload';
	import { getAcceptAttribute } from './utils';
	import type { FileUploadDropzoneProps } from './types';
	import PhUploadSimple from '$lib/icons/PhUploadSimple.svelte';

	let {
		fileType,
		label = 'Drag and drop images here or click to upload.',
		maxFiles = 1,
		onFileAccept,
		...restProps
	}: FileUploadDropzoneProps = $props();

	const accept = $derived(getAcceptAttribute(fileType));
</script>

<FileUpload.Root {maxFiles} {accept} {onFileAccept} {...restProps}>
	<FileUpload.Dropzone
		class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center text-ink-dim transition-colors hover:border-primary/50 data-dragging:border-primary data-dragging:bg-primary/5"
	>
		<PhUploadSimple class="size-8 opacity-60" />
		<span class="text-sm">{label}</span>
	</FileUpload.Dropzone>
	<FileUpload.HiddenInput />
</FileUpload.Root>
