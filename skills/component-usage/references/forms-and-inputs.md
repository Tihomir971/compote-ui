# Forms And Inputs

## Field

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
rather than stacking under it. For a field that never surfaces validation (a toolbar search box,
say), pass `hideMessageLine` to drop the spacer entirely:

```svelte
<Field.Root hideMessageLine>
	<Field.Input bind:value={search} placeholder="Search..." />
</Field.Root>
```

`Field.Textarea` composes the same way as `Field.Input`:

```svelte
<Field.Root required>
	<Field.Label>Bio</Field.Label>
	<Field.Textarea bind:value={bio} rows={4} />
	<Field.HelperText>Max 500 characters.</Field.HelperText>
</Field.Root>
```

**Components that wrap their own control** — `PasswordInput`, `NumberInput`, `Select`, the date
components — read `invalid`/`required`/`disabled`/`readOnly` from `Field.Root`'s context directly.
Don't pass those props to both the field and the wrapped control.

## Select

Single-value dropdown using `{ value, label }` items:

```svelte
<script lang="ts">
	const items = [
		{ value: 'apple', label: 'Apple' },
		{ value: 'banana', label: 'Banana', disabled: true }
	];

	let value = $state<string | null>(null);
</script>

<Select {items} label="Fruit" bind:value placeholder="Select..." />
```

### Form submission (hidden select)

`Select` renders Ark UI's `Select.HiddenSelect` — a real visually-hidden `<select>`. Pass `name`
and the value is serialized by `FormData`, so it works with native forms, SvelteKit form actions,
and remote `form()` functions.

```svelte
<form {...createPost}>
	<Select {items} label="Fruit" name="fruit" />
	<Select items={amounts} label="Amount" name="n:amount" />
</form>
```

- **Nothing selected omits the key entirely** — the hidden select sits at `selectedIndex: -1`, so
  the field is absent from `FormData` (`undefined`, not `''`). Pair it with `v.optional(...)`.
- **Numbers need the `n:` name prefix** (e.g. `name="n:amount"`) — values are otherwise strings;
  SvelteKit resolves coercion from the field name, not the element type.
- **`form.fields.x.value()` is stale on the client** — SvelteKit syncs field state from `input`
  events, and the Ark trigger sets the value programmatically without firing one. Use `bind:value`
  for client-side reads.
- **No progressive enhancement** — the hidden select is `tabIndex: -1` and the trigger is
  JS-driven.

## Combobox

Searchable select with optional multi-select and client-side filtering.

```svelte
<Combobox items={langs} label="Language" bind:value={lang} placeholder="Choose..." />
<Combobox items={langs} label="Languages" bind:value={langs} multiple placeholder="Choose..." />
<Combobox items={results} label="User" bind:value={userId} loading={fetching} />
```

## Checkbox / CheckboxGroup

```svelte
<Checkbox label="I agree to the terms" bind:checked />

<!-- Helper text below the label -->
<Checkbox label="Subscribe to newsletter" bind:checked>Receive weekly digest emails.</Checkbox>
```

`CheckboxGroup` renders a set of checkboxes from `{ value, label }` items and binds an array:

```svelte
<script lang="ts">
	const items = [
		{ value: 'svelte', label: 'Svelte' },
		{ value: 'react', label: 'React' }
	];
	let selected = $state(['svelte']);
</script>

<CheckboxGroup {items} bind:value={selected} orientation="vertical" />
```

## TagsInput

Free-text tag entry — type a value and press `Enter`/`,` to add it, click the `×` to remove it.
`value` is a plain `string[]`.

```svelte
<script lang="ts">
	let value = $state(['Svelte', 'React']); // predefined tags
</script>

<TagsInput label="Frameworks" bind:value placeholder="Add a tag" />
```

If selection must be restricted to a fixed set (pick-only, no free text), use `Combobox` with
`multiple` instead — `TagsInput` accepts arbitrary typed text.

## Switch

```svelte
<Switch label="Dark mode" bind:checked={darkMode} />
```

`labelSpacer` adds vertical space to align a labelless switch with adjacent labeled fields.

## NumberInput

```svelte
<NumberInput label="Quantity" bind:value={qty} min={0} max={100} step={1} />
<NumberInput
	label="Price"
	bind:value={price}
	formatOptions={{ style: 'currency', currency: 'USD' }}
/>
```

Props: `value?: number | null` (bindable), `label?`, `readonly?`, `layout?: 'vertical' | 'horizontal'`,
plus Ark UI NumberInput props (`min`, `max`, `step`, `formatOptions`, `locale`).

## PasswordInput

Password field with a built-in show/hide toggle. The underlying `<input>` is a real DOM input —
pass `name` and it's included in `FormData` directly, no hidden input needed.

```svelte
<form method="post">
	<PasswordInput label="Password" name="password" required />
	<button type="submit">Sign in</button>
</form>
```

## PhoneInput

International phone input wrapping `svelte-tel-input`. `value` is always E.164
(e.g. `+12015550123`); `country` is an ISO 3166-1 alpha-2 code.

```svelte
<script lang="ts">
	let phone = $state('');
	let country = $state<CountryCode | null>('US');
	let valid = $state(false);
</script>

<PhoneInput label="Phone" bind:value={phone} bind:country bind:valid />
```

`options?: TelInputOptions` (from `svelte-tel-input/types`) configures parsing/validation:
`autoPlaceholder`, `spaces`, `validateOn`, `allowedCountries`, `lockCountry`. The country picker is
an Ark UI `Select` (not a native `<select>`) with no search/filter yet.

## Listbox

`Listbox.Content` exposes filtered `items` and grouped `group` snippet data. `Listbox.Input`
auto-wires filter state via context — no props needed.

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

## Date components

`DateField`, `DateRangeField`, `DateInput`, and `DatePicker` all accept
`DateValue | string | Date | null` for `value`/`defaultValue` — bind directly to DB values, no
`parseDate`/`.toString()` conversion needed. The bound value round-trips in the same shape given
(string in → string out, `Date` in → `Date` out); if it starts `null`, changes emit as a string.
`DateRangeField` uses the same notation on separate `start`/`end` props instead of an array `value`.

`locale`/`timeZone` default to the nearest `LocaleProvider` / the user's local zone. For UTC values
from a DB (`timestamptz`), bind the ISO string with its offset and leave `timeZone` unset — the
component displays local time and emits UTC back.

String auto-detection (space separator and bare `+00` offset are normalized):

- `"2024-01-15"` → date-only → emits `"2024-01-15"`
- `"2024-01-15T10:30:00"` → naive datetime → emits the same shape
- `"2024-01-15T10:30:00Z"` / `"...+02:00"` → zoned, displayed local, emits UTC absolute string

A zoned value at time granularity would render a trailing timezone segment (`GMT+2`); all three
segmented components hide it by default — pass `hideTimeZone={false}` to show it.

### Form submission (ISO hidden inputs)

Give any date component a `name` and it renders a hidden input carrying a canonical **ISO
string**, never the locale-formatted display value.

```svelte
<DateField label="Date" bind:value name="start_date" />
```

`DateRangeField` is the exception — one field name can't carry two dates, so `name="stay"` is
shorthand for **two** hidden inputs, `stayStart`/`stayEnd`. Use `startName`/`endName` to name each
side outright. An unpicked end date submits as `''`, not an absent key.

```ts
// +page.server.ts
const start = formData.get('stayStart'); // '2025-06-01'
const end = formData.get('stayEnd'); // '', if not picked yet
```

**With SvelteKit remote functions:** bind strings, not `DateValue` — `query`/`command` args are
serialized with devalue, which doesn't handle `@internationalized/date` instances. Binding a DB
string keeps the value serializable end to end. `form.fields.x.value()` also goes stale here (the
component sets the hidden input's value programmatically without firing `input`) — read from
`bind:` instead. For full `form` integration (repopulation after a failed submit, `aria-invalid`),
render the hidden inputs yourself with `.as('hidden', value)` rather than relying on `name`.

### DateField ← recommended primary component

Segmented date input (separate day/month/year fields) with an optional calendar popup — no format
ambiguity, keyboard-incrementable segments, proper ARIA labels.

```svelte
<DateField label="Date" bind:value {min} {max} />
<DateField label="Updated at" granularity="minute" bind:value={row.updated_at} />
```

### DateRangeField

Two segment groups wired to a shared calendar, bound separately via `bind:start`/`bind:end`.

```svelte
<DateRangeField label="Stay" bind:start bind:end />
```

`end` is ignored while `start` is empty — zag reads the range positionally.

### DateInput

Segmented input **without** a calendar popup — compact, keyboard-only entry.

```svelte
<DateInput label="Date & time" bind:value={row.updated_at} granularity="minute" />
```

For a nullable string column that starts empty, initialize as `''` (not `null`) so the value stays
serializable as a string.

### DatePicker

Free-text input with a calendar popup — simpler, less accessible than `DateField`. Prefer
`DateField` for most cases.

```svelte
<DatePicker label="Date" bind:value placeholder="MM/DD/YYYY" />
```
