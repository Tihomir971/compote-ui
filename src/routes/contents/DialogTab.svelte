<script lang="ts">
	import { Button, Dialog, AlertDialog } from '$lib';

	let dialogOpen = $state(false);
	let alertDialogOpen = $state(false);
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Dialog Examples</h2>
		<div class="flex flex-col gap-4">
			<Button onclick={() => (dialogOpen = true)}>Open Dialog</Button>
			<Dialog
				bind:open={dialogOpen}
				title="Confirm Action"
				description="Are you sure you want to proceed with this action? This cannot be undone."
			>
				<p class="text-sm">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</p>
				{#snippet footer()}
					<Button variant="outline" onclick={() => (dialogOpen = false)}>Cancel</Button>
					<Button onclick={() => (dialogOpen = false)}>Confirm</Button>
				{/snippet}
			</Dialog>

			<Button onclick={() => (alertDialogOpen = true)}>Open Alert Dialog</Button>
			<AlertDialog
				bind:open={alertDialogOpen}
				title="Alert"
				description="This is an alert dialog. Please confirm you understand this message."
			/>
		</div>
	</section>
</div>
