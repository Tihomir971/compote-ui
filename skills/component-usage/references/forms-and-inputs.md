# Forms And Inputs

Use `Field.Root` to propagate `invalid`, `disabled`, `required`, and `readOnly` state.

```svelte
<Field.Root required invalid={!email}>
	<Field.Label>Email</Field.Label>
	<Field.Input bind:value={email} type="email" />
	<Field.ErrorText>Email is required.</Field.ErrorText>
</Field.Root>
```

With a form adapter, `Field.Root` derives invalid/required state and renders the first error:

```svelte
<Field.Root {form} field="email" helperText="We'll never share your email.">
	<Field.Label>Email</Field.Label>
	<Field.Input bind:value={email} type="email" />
</Field.Root>
```

`errorText` is the per-field route to that same line, for validation that doesn't fit the adapter's
`Record<string, string[]>` shape — a SvelteKit remote form's `field.issues()`, say. **Passing it
marks the field invalid**; an explicit `invalid` still wins, and the adapter wins over both.

```svelte
<Field.Root required errorText={fields.password.issues()?.[0]?.message}>
	<PasswordInput label="Password" name={fields.password.as('password').name} />
</Field.Root>
```

One message, not a list: several errors on one value are usually stages of the same judgement, and a
stack that grows and shrinks per keystroke is what makes a form jump. Independent requirements (a
password policy) belong in a persistent checklist shown from the start, not in error text. Where you
genuinely need several, `<Field.ErrorText>` children still work.

The message line is **always held open**, so a field never changes height when an error appears and
nothing below it moves. Errors and `helperText` share that line — an error replaces the helper
rather than stacking under it.

List controls use `{ value, label }` items:

```svelte
<script lang="ts">
	const items = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana', disabled: true }
	];

	let value = $state<string | null>(null);
</script>

<Select {items} label="Fruit" bind:value placeholder="Select..." />
<Combobox {items} label="Fruit" bind:value />
```

Use `DateField` as the default accessible date input:

```svelte
<script lang="ts">
	import type { DateValue } from 'compote-ui';

	let value = $state<DateValue | null>(null);
</script>

<DateField label="Date" bind:value />
```

Use `DateRangeField` for ranges:

```svelte
<script lang="ts">
	import type { DateValue } from 'compote-ui';

	let range = $state<DateValue[]>([]);
</script>

<DateRangeField label="Range" bind:value={range} />
```

Use `DateInput` when binding existing `string`, `Date`, or `DateValue` values without a calendar popup.

`PhoneInput` stores E.164 values:

```svelte
<script lang="ts">
	let phone = $state('');
	let country = $state(null);
	let valid = $state(false);
</script>

<PhoneInput label="Phone" bind:value={phone} bind:country bind:valid />
```

`Listbox.Content` exposes filtered `items` and grouped `group` snippet data:

```svelte
<Listbox.Root {items} bind:value={selected}>
	<Listbox.Label>Pick items</Listbox.Label>
	<Listbox.Input placeholder="Search..." />
	<Listbox.Content>
		{#snippet items({ items })}
			{#each items as item (item.value)}
				<Listbox.Item {item}>
					<Listbox.ItemText>{item.label}</Listbox.ItemText>
					<Listbox.ItemIndicator />
				</Listbox.Item>
			{/each}
			<Listbox.Empty>No results</Listbox.Empty>
		{/snippet}
	</Listbox.Content>
</Listbox.Root>
```
