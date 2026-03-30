<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog } from '@ark-ui/svelte/dialog';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import PhX from '$lib/icons/PhX.svelte';

	interface Props {
		open: boolean;
		title: string;
		description?: string;
		children: Snippet;
		footer?: Snippet;
		onClose?: () => void;
		contentClass?: string;
	}

	let {
		open = $bindable(),
		title,
		description,
		children,
		footer,
		onClose,
		contentClass
	}: Props = $props();
</script>

<Dialog.Root bind:open lazyMount unmountOnExit>
	<Portal>
		<Dialog.Backdrop
			class="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/50"
		/>
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<Dialog.Content
				class={cn(
					'bg-background data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative w-full max-w-2xl rounded-lg border p-6 shadow-xl',
					contentClass
				)}
			>
				<Dialog.Title class="text-lg font-semibold">{title}</Dialog.Title>
				{#if description}
					<Dialog.Description class="text-muted-foreground mt-1 text-sm">
						{description}
					</Dialog.Description>
				{/if}

				<div class="mt-4">
					{@render children()}
				</div>

				{#if footer}
					<div class="mt-4 flex justify-end gap-3">
						{@render footer()}
					</div>
				{/if}

				<Dialog.CloseTrigger
					class="focus:ring-ring absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
					onclick={onClose}
				>
					<PhX class="size-4" />
					<span class="sr-only">Close</span>
				</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog.Root>
