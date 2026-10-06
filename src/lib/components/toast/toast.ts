import { createToaster } from '@ark-ui/svelte/toast';
import type { CreateToasterReturn } from '@ark-ui/svelte/toast';

export type ToastOptions = Parameters<CreateToasterReturn['create']>[0];
export type ToastType = NonNullable<ToastOptions['type']>;

const toaster = createToaster({
	placement: 'bottom-end',
	pauseOnPageIdle: true,
	duration: 5000
});

const typeDurations: Partial<Record<ToastType, number>> = { success: 4000, error: 10000 };

function shorthand(type: ToastType) {
	const duration = typeDurations[type];
	// Only set when defined: an explicit `duration: undefined` would override the global default.
	const defaults = duration === undefined ? {} : { duration };
	return (title: string | ToastOptions, options?: Omit<ToastOptions, 'type'>) =>
		typeof title === 'string'
			? toaster.create({ ...defaults, ...options, title, type })
			: toaster.create({ ...defaults, ...title, type });
}

export const toast = Object.assign(toaster, {
	info: shorthand('info'),
	success: shorthand('success'),
	warning: shorthand('warning'),
	error: shorthand('error'),
	loading: shorthand('loading')
});
