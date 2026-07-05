<script lang="ts">
	import { cn } from 'tailwind-variants';
	import * as Menu from '../menu';
	import ImageCropDialog from '../image-crop-dialog/image-crop-dialog.svelte';
	import { fileToDataUrl } from '$lib/utils/image-processing';
	import { PhUploadSimple, PhImage, PhX } from '$lib/icons';
	import type { ImageUploadProps } from './types';

	let {
		value = $bindable(),
		alt = 'Image',
		shape = 'circle',
		class: className,
		disabled = false,
		aspectRatio,
		processOptions,
		uploadLabel = 'Upload image',
		replaceLabel = 'Replace',
		deleteLabel = 'Delete',
		onChange,
		onDelete
	}: ImageUploadProps = $props();

	let inputEl = $state<HTMLInputElement>();
	let cropOpen = $state(false);
	let cropSrc = $state('');

	function openPicker() {
		inputEl?.click();
	}

	async function handleInputChange(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		input.value = '';
		if (!file) return;
		cropSrc = await fileToDataUrl(file);
		cropOpen = true;
	}

	function handleCropConfirm(blob: Blob) {
		cropOpen = false;
		if (value?.startsWith('blob:')) URL.revokeObjectURL(value);
		value = URL.createObjectURL(blob);
		onChange?.(blob);
	}

	function handleDelete() {
		if (value?.startsWith('blob:')) URL.revokeObjectURL(value);
		value = undefined;
		onDelete?.();
	}
</script>

<div
	class={cn(
		'relative inline-flex size-24 shrink-0 items-center justify-center overflow-hidden bg-surface-2 text-ink-dim',
		shape === 'circle' ? 'rounded-full' : 'rounded-lg',
		className
	)}
>
	{#if value}
		<img src={value} {alt} class="h-full w-full object-cover" />
	{:else}
		<PhImage class="size-1/3" />
	{/if}

	<Menu.Root positioning={{ placement: 'bottom-end' }}>
		<Menu.Trigger
			variant="outline"
			size="icon-sm"
			class={cn(
				'absolute right-1 bottom-1 rounded-full bg-surface-1 shadow-sm',
				disabled && 'pointer-events-none opacity-50'
			)}
		>
			<span class="sr-only">{value ? 'Edit image' : uploadLabel}</span>
			<PhUploadSimple class="size-4" />
		</Menu.Trigger>
		<Menu.Content>
			<Menu.Item value="upload" {disabled} onSelect={openPicker}>
				<PhUploadSimple class="size-4" />
				{value ? replaceLabel : uploadLabel}
			</Menu.Item>
			{#if value}
				<Menu.Item value="delete" {disabled} onSelect={handleDelete}>
					<PhX class="size-4" />
					{deleteLabel}
				</Menu.Item>
			{/if}
		</Menu.Content>
	</Menu.Root>
</div>

<input
	bind:this={inputEl}
	type="file"
	accept="image/*"
	{disabled}
	class="hidden"
	onchange={handleInputChange}
/>

<ImageCropDialog
	bind:open={cropOpen}
	imageSrc={cropSrc}
	{aspectRatio}
	{processOptions}
	onConfirm={handleCropConfirm}
	onCancel={() => (cropOpen = false)}
/>
