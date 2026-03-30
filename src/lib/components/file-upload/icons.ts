import PhFile from '$lib/icons/PhFile.svelte';
import PhFileArchive from '$lib/icons/PhFileArchive.svelte';
import PhFileText from '$lib/icons/PhFileText.svelte';
import PhImage from '$lib/icons/PhImage.svelte';
import PhMicrosoftExcelLogo from '$lib/icons/PhMicrosoftExcelLogo.svelte';
import PhVideoCamera from '$lib/icons/PhVideoCamera.svelte';
import PhHeadphones from '$lib/icons/PhHeadphones.svelte';

export const getFileIcon = (file: File) => {
	const fileType = file.type;
	const fileName = file.name;

	if (
		fileType.includes('pdf') ||
		fileName.endsWith('.pdf') ||
		fileType.includes('word') ||
		fileName.endsWith('.doc') ||
		fileName.endsWith('.docx')
	) {
		return PhFileText;
	} else if (
		fileType.includes('zip') ||
		fileType.includes('archive') ||
		fileName.endsWith('.zip') ||
		fileName.endsWith('.rar')
	) {
		return PhFileArchive;
	} else if (
		fileType.includes('excel') ||
		fileName.endsWith('.xls') ||
		fileName.endsWith('.xlsx')
	) {
		return PhMicrosoftExcelLogo;
	} else if (fileType.includes('video/')) {
		return PhVideoCamera;
	} else if (fileType.includes('audio/')) {
		return PhHeadphones;
	} else if (fileType.startsWith('image/')) {
		return PhImage;
	}
	return PhFile;
};
