<script lang="ts">
	import { Dialog } from '@ark-ui/svelte/dialog';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import type { DialogProps } from './dialog.types';

	let {
		open = $bindable(),
		children,
		contentClass,
		lazyMount = true,
		unmountOnExit = true,
		onOpenChange,
		...restProps
	}: DialogProps = $props();

	function handleOpenChange(details: { open: boolean }) {
		open = details.open;
		onOpenChange?.(details);
	}
</script>

<Dialog.Root {open} {lazyMount} {unmountOnExit} onOpenChange={handleOpenChange} {...restProps}>
	<Portal>
		<Dialog.Backdrop
			class="fixed inset-0 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0"
			style="z-index: calc(50 + var(--layer-index, 0))"
		/>
		<Dialog.Positioner
			class="fixed inset-0 flex items-center justify-center p-4"
			style="z-index: calc(50 + var(--layer-index, 0))"
		>
			<Dialog.Content
				class={cn(
					'relative w-full max-w-2xl rounded-lg border bg-surface-1 p-6 shadow-xl data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
					contentClass
				)}
			>
				{@render children()}
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog.Root>
