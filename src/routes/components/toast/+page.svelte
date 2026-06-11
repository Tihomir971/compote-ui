<script lang="ts">
	import { createToaster } from '@ark-ui/svelte/toast';
	import { Toast } from '$lib';

	const toaster = createToaster({ placement: 'top-end' });

	function showInfo() {
		toaster.create({
			title: 'Information',
			description: 'This is an informational message.',
			type: 'info'
		});
	}

	function showSuccess() {
		toaster.create({
			title: 'Success',
			description: 'Your action was completed successfully.',
			type: 'success'
		});
	}

	function showError() {
		toaster.create({
			title: 'Error',
			description: 'Something went wrong. Please try again.',
			type: 'error'
		});
	}

	function showWarning() {
		toaster.create({
			title: 'Warning',
			description: 'Please review your input before proceeding.',
			type: 'warning'
		});
	}

	function showTitleOnly() {
		toaster.create({
			title: 'Quick notification',
			type: 'info'
		});
	}
</script>

<Toast.Toaster {toaster} />

<div class="space-y-6 p-8">
	<h1 class="text-2xl font-semibold text-ink">Toast</h1>
	<p class="text-ink-dim">
		Temporary notification messages that appear and automatically dismiss after a timeout.
	</p>

	<div class="flex flex-wrap gap-3">
		<button
			onclick={showInfo}
			class="rounded-md border border-blue-500/50 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:bg-blue-950/50"
		>
			Show Info
		</button>
		<button
			onclick={showSuccess}
			class="rounded-md border border-green-500/50 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-300 dark:hover:bg-green-950/50"
		>
			Show Success
		</button>
		<button
			onclick={showError}
			class="rounded-md border border-red-500/50 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-300 dark:hover:bg-red-950/50"
		>
			Show Error
		</button>
		<button
			onclick={showWarning}
			class="rounded-md border border-yellow-500/50 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/30 dark:text-yellow-300 dark:hover:bg-yellow-950/50"
		>
			Show Warning
		</button>
		<button
			onclick={showTitleOnly}
			class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
		>
			Title Only
		</button>
	</div>
</div>
