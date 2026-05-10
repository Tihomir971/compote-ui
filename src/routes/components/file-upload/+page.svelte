<script lang="ts">
	import { Field, FileUpload } from '$lib';
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Single file</h2>
		<FileUpload fileType="pdf" label="Upload document" />
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Multiple files</h2>
		<FileUpload fileType="image" label="Upload images" maxFiles={3} triggerLabel="Add image" />
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">With field (helper + error text)</h2>
		<Field.Root>
			<FileUpload fileType="excel" label="Spreadsheet" maxFileSize={2_000_000} />
			<Field.HelperText>Max 2 MB, .xls or .xlsx only</Field.HelperText>
		</Field.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled</h2>
		<FileUpload fileType="pdf" label="Upload document" disabled />
	</section>
</div>
