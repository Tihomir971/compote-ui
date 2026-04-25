import type { AvatarRootBaseProps } from '@ark-ui/svelte/avatar';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<AvatarRootBaseProps, 'children' | 'asChild' | 'ref'> {
	src?: string;
	alt?: string;
	fallback?: string;
	size?: AvatarSize;
}
