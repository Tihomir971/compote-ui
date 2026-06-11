import { createToaster } from '@ark-ui/svelte/toast';
import type { CreateToasterReturn } from '@ark-ui/svelte/toast';

export type ToastOptions = Parameters<CreateToasterReturn['create']>[0];
export type ToastType = NonNullable<ToastOptions['type']>;

const toaster = createToaster({ placement: 'bottom-end', pauseOnPageIdle: true });

function shorthand(type: ToastType) {
	return (title: string | ToastOptions, options?: Omit<ToastOptions, 'type'>) =>
		typeof title === 'string'
			? toaster.create({ ...options, title, type })
			: toaster.create({ ...title, type });
}

export const toast = Object.assign(toaster, {
	info: shorthand('info'),
	success: shorthand('success'),
	warning: shorthand('warning'),
	error: shorthand('error'),
	loading: shorthand('loading')
});
