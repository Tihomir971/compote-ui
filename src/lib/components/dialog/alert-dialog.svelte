<script lang="ts">
	import PhX from '$lib/icons/PhX.svelte';
	import { Dialog } from '@ark-ui/svelte/dialog';
	import { Portal } from '@ark-ui/svelte/portal';

	type Variant = 'default' | 'destructive';

	type Props = {
		open: boolean;
		title: string;
		description?: string | string[];
		confirmLabel?: string;
		cancelLabel?: string;
		onConfirm?: () => void;
		variant?: Variant;
	};

	let {
		open = $bindable(),
		title,
		description,
		confirmLabel = 'Confirm',
		cancelLabel = 'Cancel',
		onConfirm,
		variant = 'default'
	}: Props = $props();

	const confirmClass = $derived(
		variant === 'destructive'
			? 'inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
			: 'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
	);
</script>

<Dialog.Root role="alertdialog" bind:open>
	<Portal>
		<Dialog.Backdrop
			class="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/50"
		/>
		<Dialog.Positioner class="fixed inset-0 z-50 flex items-center justify-center">
			<Dialog.Content
				class="bg-background data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 relative w-full max-w-md rounded-lg border p-6 shadow-xl"
			>
				<Dialog.Title class="text-lg leading-none font-semibold tracking-tight">
					{title}
				</Dialog.Title>
				{#if description}
					<Dialog.Description class="text-muted-foreground mt-2 text-sm">
						{#each Array.isArray(description) ? description : [description] as line}
							<span class="block">{line}</span>
						{/each}
					</Dialog.Description>
				{/if}
				<div class="mt-6 flex justify-end gap-3">
					<Dialog.CloseTrigger
						class="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
					>
						{cancelLabel}
					</Dialog.CloseTrigger>
					<button type="button" class={confirmClass} onclick={onConfirm}>
						{confirmLabel}
					</button>
				</div>
				<Dialog.CloseTrigger
					class="ring-offset-background focus:ring-ring absolute top-3 right-3 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-none"
				>
					<PhX class="h-4 w-4" />
					<span class="sr-only">Close</span>
				</Dialog.CloseTrigger>
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog.Root>
