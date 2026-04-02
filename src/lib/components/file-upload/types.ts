import type { FileUploadRootProps } from '@ark-ui/svelte/file-upload';
import type { FileType } from './utils';

export interface FileUploadDropzoneProps extends FileUploadRootProps {
	fileType: FileType;
	label: string;
}

export interface FileUploadProps extends Omit<FileUploadRootProps, 'accept'> {
	fileType?: FileType;
	label?: string;
	triggerLabel?: string;
	maxFiles?: number;
}
