import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import type { Component } from 'svelte';
import Field from './field.svelte';
import type { FormAdapter } from './types';

/** The message line Field.Root renders under the control, stripped of markup. */
function message(props: Record<string, unknown>): string {
	const { body } = render(Field as Component, { props });
	return body
		.replace(/<[^>]*>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/** Whether the control is marked invalid, as any child part would read it. */
function isInvalid(props: Record<string, unknown>): boolean {
	const { body } = render(Field as Component, { props });
	return /data-invalid/.test(body);
}

/** Whether the always-present spacer is what filled the message line. */
function hasSpacer(props: Record<string, unknown>): boolean {
	const { body } = render(Field as Component, { props });
	return /aria-hidden="true"/.test(body);
}

// The regression this guards is silent: Ark's Field.ErrorText renders only when
// the field context says invalid, so an `errorText` that did not also imply
// `invalid` would be swallowed with no warning anywhere.
describe('errorText', () => {
	it('renders without invalid having to be passed alongside it', () => {
		expect(message({ errorText: 'Password is too short.' })).toBe('Password is too short.');
	});

	it('marks the field invalid on its own', () => {
		expect(isInvalid({ errorText: 'Password is too short.' })).toBe(true);
	});

	it('replaces helperText rather than stacking under it', () => {
		expect(message({ errorText: 'Too short.', helperText: 'At least 8 characters.' })).toBe(
			'Too short.'
		);
	});

	it('falls back to helperText once cleared', () => {
		expect(message({ errorText: null, helperText: 'At least 8 characters.' })).toBe(
			'At least 8 characters.'
		);
	});

	it.each([
		['null', null],
		['undefined', undefined],
		['an empty string', '']
	])('leaves the field valid when it is %s', (_label, value) => {
		expect(isInvalid({ errorText: value })).toBe(false);
	});

	// The escape hatch: a field that should look invalid without a message, or
	// carry a message without the invalid styling, still can.
	it('lets an explicit invalid win over the implication', () => {
		expect(isInvalid({ errorText: 'Too short.', invalid: false })).toBe(false);
	});

	it('honours invalid on its own, with no message', () => {
		expect(isInvalid({ invalid: true })).toBe(true);
	});
});

// `form` + `field` and `errorText` are two routes to the same line. The adapter
// wins, consistent with how it already overrides invalid and required.
describe('the FormAdapter takes precedence', () => {
	const form: FormAdapter = {
		invalid: () => true,
		isRequired: () => true,
		errors: { email: ['Enter a valid email.', 'Second issue that is not shown.'] }
	};

	it('renders the adapter error over a passed errorText', () => {
		expect(message({ form, field: 'email', errorText: 'Ignored.' })).toBe('Enter a valid email.');
	});

	it('shows only the first of several issues', () => {
		expect(message({ form, field: 'email' })).toBe('Enter a valid email.');
	});
});

// Every field keeps the same height whether or not it has anything to say, so a
// form does not reflow the moment validation fires.
describe('the message line is always held open', () => {
	it('renders a spacer when there is neither an error nor a helper', () => {
		expect(hasSpacer({})).toBe(true);
	});

	it.each([
		['an error', { errorText: 'Too short.' }],
		['a helper', { helperText: 'At least 8 characters.' }]
	])('drops the spacer once %s occupies the line', (_label, props) => {
		expect(hasSpacer(props)).toBe(false);
	});

	it('hides the spacer from assistive technology', () => {
		expect(message({})).toBe('');
	});
});
