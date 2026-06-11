<script lang="ts">
	import { Toast, Toaster } from '@ark-ui/svelte/toast';
	import type { CreateToasterReturn } from '@ark-ui/svelte/toast';
	import { Portal } from '@ark-ui/svelte/portal';
	import { cn } from 'tailwind-variants';
	import type { ClassValue } from 'tailwind-variants';
	import { toast } from './toast.js';
	import PhX from '$lib/icons/PhX.svelte';
	import PhCheckCircle from '$lib/icons/PhCheckCircle.svelte';
	import PhXCircle from '$lib/icons/PhXCircle.svelte';
	import PhWarning from '$lib/icons/PhWarning.svelte';
	import PhInfo from '$lib/icons/PhInfo.svelte';
	import PhCircleNotch from '$lib/icons/PhCircleNotch.svelte';

	interface Props {
		class?: ClassValue;
		/** Custom toaster instance from `createToaster()`. Defaults to the shared `toast` instance. */
		toaster?: CreateToasterReturn;
	}

	let { class: className, toaster: toasterInstance = toast }: Props = $props();
</script>

<Portal>
	<Toaster toaster={toasterInstance}>
		{#snippet children(toastItem)}
			{@const t = toastItem()}
			<Toast.Root
				class={cn(
					'relative flex min-w-80 items-start gap-3 rounded-lg border border-border bg-surface-1 p-4 pr-8 shadow-lg transition-all duration-200',
					'data-[type=success]:border-success/50 data-[type=success]:bg-[color-mix(in_oklab,var(--color-success)_8%,var(--color-surface-1))]',
					'data-[type=error]:border-danger/50 data-[type=error]:bg-[color-mix(in_oklab,var(--color-danger)_8%,var(--color-surface-1))]',
					'data-[type=warning]:border-warning/50 data-[type=warning]:bg-[color-mix(in_oklab,var(--color-warning)_8%,var(--color-surface-1))]',
					'data-[type=info]:border-info/50 data-[type=info]:bg-[color-mix(in_oklab,var(--color-info)_8%,var(--color-surface-1))]',
					className
				)}
				style="translate: var(--x) var(--y); scale: var(--scale); z-index: var(--z-index); height: var(--height); opacity: var(--opacity); will-change: translate, scale, opacity;"
			>
				{#if t.type === 'success'}
					<PhCheckCircle class="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
				{:else if t.type === 'error'}
					<PhXCircle class="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
				{:else if t.type === 'warning'}
					<PhWarning class="mt-0.5 size-5 shrink-0 text-warning" aria-hidden="true" />
				{:else if t.type === 'info'}
					<PhInfo class="mt-0.5 size-5 shrink-0 text-info" aria-hidden="true" />
				{:else if t.type === 'loading'}
					<PhCircleNotch
						class="mt-0.5 size-5 shrink-0 animate-spin text-ink-dim"
						aria-hidden="true"
					/>
				{/if}
				<div class="min-w-0 flex-1">
					{#if t.title}
						<Toast.Title class="text-sm font-medium text-ink">{t.title}</Toast.Title>
					{/if}
					{#if t.description}
						<Toast.Description class="mt-1 text-sm text-ink-dim">{t.description}</Toast.Description>
					{/if}
					{#if t.action}
						<Toast.ActionTrigger
							class="mt-2 inline-flex h-7 items-center rounded-md border border-border bg-surface-1 px-2.5 text-xs font-medium text-ink shadow-sm hover:bg-surface-2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
						>
							{t.action.label}
						</Toast.ActionTrigger>
					{/if}
				</div>
				<Toast.CloseTrigger
					class="absolute top-1.5 right-1.5 rounded p-1 text-ink-dim hover:bg-surface-2 hover:text-ink focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none"
					aria-label="Close notification"
				>
					<PhX class="size-3.5" />
				</Toast.CloseTrigger>
			</Toast.Root>
		{/snippet}
	</Toaster>
</Portal>
