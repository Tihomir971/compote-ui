<script lang="ts">
	import { Toast, toast } from '$lib';

	function fakeRequest(shouldFail = false) {
		return new Promise<string>((resolve, reject) => {
			setTimeout(() => {
				if (shouldFail) reject(new Error('Network error'));
				else resolve('report.pdf');
			}, 2000);
		});
	}
</script>

<Toast.Toaster />

<div class="space-y-8 p-8">
	<div class="space-y-2">
		<h1 class="text-2xl font-semibold text-ink">Toast</h1>
		<p class="text-ink-dim">
			Temporary notification messages that appear and automatically dismiss after a timeout.
		</p>
	</div>

	<section class="space-y-3">
		<h2 class="text-lg font-medium text-ink">Shorthand helpers</h2>
		<div class="flex flex-wrap gap-3">
			<button
				onclick={() =>
					toast.info('Information', { description: 'This is an informational message.' })}
				class="rounded-md border border-info/50 px-4 py-2 text-sm font-medium text-info hover:bg-info/10"
			>
				toast.info()
			</button>
			<button
				onclick={() =>
					toast.success('Success', { description: 'Your action was completed successfully.' })}
				class="rounded-md border border-success/50 px-4 py-2 text-sm font-medium text-success hover:bg-success/10"
			>
				toast.success()
			</button>
			<button
				onclick={() =>
					toast.warning('Warning', { description: 'Please review your input before proceeding.' })}
				class="rounded-md border border-warning/50 px-4 py-2 text-sm font-medium text-warning hover:bg-warning/10"
			>
				toast.warning()
			</button>
			<button
				onclick={() =>
					toast.error('Error', { description: 'Something went wrong. Please try again.' })}
				class="rounded-md border border-danger/50 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10"
			>
				toast.error()
			</button>
			<button
				onclick={() => toast.info('Quick notification')}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				Title only
			</button>
		</div>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-medium text-ink">Action button</h2>
		<div class="flex flex-wrap gap-3">
			<button
				onclick={() =>
					toast.create({
						title: 'File deleted',
						description: 'photo.jpg was moved to trash.',
						type: 'info',
						action: {
							label: 'Undo',
							onClick: () => toast.success('Restored', { description: 'photo.jpg is back.' })
						}
					})}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				With action
			</button>
		</div>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-medium text-ink">Loading &amp; promise</h2>
		<div class="flex flex-wrap gap-3">
			<button
				onclick={() => {
					const id = toast.loading('Uploading…', { description: 'Please wait.' });
					setTimeout(
						() => toast.update(id, { title: 'Uploaded', description: 'Done.', type: 'success' }),
						2500
					);
				}}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				toast.loading() + update
			</button>
			<button
				onclick={() =>
					toast.promise(fakeRequest(), {
						loading: { title: 'Generating report…' },
						success: { title: 'Report ready', description: 'report.pdf was generated.' },
						error: { title: 'Generation failed', description: 'Please try again.' }
					})}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				toast.promise() — resolves
			</button>
			<button
				onclick={() =>
					toast.promise(fakeRequest(true), {
						loading: { title: 'Generating report…' },
						success: { title: 'Report ready' },
						error: { title: 'Generation failed', description: 'Please try again.' }
					})}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				toast.promise() — rejects
			</button>
		</div>
	</section>

	<section class="space-y-3">
		<h2 class="text-lg font-medium text-ink">Dismiss</h2>
		<div class="flex flex-wrap gap-3">
			<button
				onclick={() => toast.dismiss()}
				class="rounded-md border border-border bg-surface-1 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-2"
			>
				Dismiss all
			</button>
		</div>
	</section>
</div>
