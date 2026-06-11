<script lang="ts">
	import { Toast, Toaster } from '@ark-ui/svelte/toast';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import type { ClassValue } from 'tailwind-variants';
	import { toast } from './toast.js';
	import PhX from '$lib/icons/PhX.svelte';

	interface Props {
		class?: ClassValue;
	}

	let { class: className }: Props = $props();
</script>

<Portal>
	<Toaster toaster={toast}>
		{#snippet children(toastItem)}
			{@const t = toastItem()}
			<Toast.Root
				class={cn(
					'relative min-w-80 rounded-lg border border-border bg-surface-1 p-4 pr-8 shadow-lg transition-all duration-200',
					'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2',
					'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-right-full',
					'data-[type=success]:border-green-500/50 data-[type=success]:bg-green-50 dark:data-[type=success]:bg-green-950/30',
					'data-[type=error]:border-red-500/50 data-[type=error]:bg-red-50 dark:data-[type=error]:bg-red-950/30',
					'data-[type=warning]:border-yellow-500/50 data-[type=warning]:bg-yellow-50 dark:data-[type=warning]:bg-yellow-950/30',
					'data-[type=info]:border-blue-500/50 data-[type=info]:bg-blue-50 dark:data-[type=info]:bg-blue-950/30',
					className
				)}
				style="translate: var(--x) var(--y); scale: var(--scale); z-index: var(--z-index); height: var(--height); opacity: var(--opacity);"
			>
				{#if t.title}
					<Toast.Title class="text-sm font-medium text-ink">{t.title}</Toast.Title>
				{/if}
				{#if t.description}
					<Toast.Description class="mt-1 text-sm text-ink-dim">{t.description}</Toast.Description>
				{/if}
				<Toast.CloseTrigger
					class="absolute right-1.5 top-1.5 rounded p-1 text-ink-dim hover:bg-surface-2 hover:text-ink"
					aria-label="Close notification"
				>
					<PhX class="size-3.5" />
				</Toast.CloseTrigger>
			</Toast.Root>
		{/snippet}
	</Toaster>
</Portal>
