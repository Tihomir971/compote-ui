/**
 * Hands `blob` to the browser as a download named `filename`. Browser-only: call it from an
 * event handler, never during SSR.
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.style.display = 'none';
	document.body.append(link);
	link.click();
	link.remove();
	// Revoking right away can cancel the download in some browsers (Safari); the URL only
	// pins the blob in memory until then.
	setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
