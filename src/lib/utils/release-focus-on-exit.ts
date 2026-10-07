function releaseFocusOnExit(event: Event) {
	const content = event.currentTarget;
	if (!(content instanceof HTMLElement)) return;
	const active = content.ownerDocument.activeElement;
	if (active instanceof HTMLElement && content.contains(active)) active.blur();
}

/**
 * Spread onto Ark overlay content (popover, dialog, drawer) so a field focused inside it blurs
 * before the content unmounts, not during the unmount.
 *
 * Zag's presence can unmount content from inside a Svelte effect (it does when the document is
 * hidden). Svelte then removes the content mid-flush; a field still focused in there blurs during
 * that removal, and zag handles some blurs with `flushSync` (DatePicker's machine, for one). That
 * nested `flushSync` breaks the outer flush: "Cannot read properties of null (reading 'clear')"
 * in Svelte's `flush_queued_effects` (still the case in svelte 5.57.2).
 *
 * Zag dispatches `exitcomplete` on the content node once presence decides to unmount, before
 * Svelte removes it. Blurring there lets the field commit on blur as usual, at a point where a
 * nested `flushSync` is safe. Usually focus is already back on the trigger by then (exit
 * animations outlast the focus restore), and this does nothing.
 *
 * A spread because Ark's content prop types don't list the `exitcomplete` event.
 */
export const releaseFocusOnExitProps = { onexitcomplete: releaseFocusOnExit };
