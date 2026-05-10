<script lang="ts">
	import { Field, Fieldset } from '$lib';

	let name = $state('');
	let email = $state('');
	let bio = $state('');
	let submitted = $state(false);

	let contactName = $state('');
	let contactEmail = $state('');
	let contactMessage = $state('');
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic Fieldset</h2>
		<Fieldset.Root>
			<Fieldset.Legend>Contact Details</Fieldset.Legend>
			<Field.Root>
				<Field.Label>Name</Field.Label>
				<Field.Input bind:value={name} placeholder="John Doe" />
			</Field.Root>
			<Field.Root>
				<Field.Label>Email</Field.Label>
				<Field.Input bind:value={email} type="email" placeholder="john@example.com" />
				<Field.HelperText>We'll never share your email.</Field.HelperText>
			</Field.Root>
			<Field.Root>
				<Field.Label>Bio</Field.Label>
				<Field.Textarea bind:value={bio} placeholder="Tell us about yourself..." rows={3} />
			</Field.Root>
		</Fieldset.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Fieldset with Helper &amp; Error Text</h2>
		<Fieldset.Root invalid={submitted && (!contactName || !contactEmail)}>
			<Fieldset.Legend>Send a Message</Fieldset.Legend>
			<Fieldset.HelperText>All fields are required.</Fieldset.HelperText>
			<Field.Root required invalid={submitted && !contactName}>
				<Field.Label>Name</Field.Label>
				<Field.Input bind:value={contactName} placeholder="Jane Smith" />
				{#if submitted && !contactName}
					<Field.ErrorText>Name is required.</Field.ErrorText>
				{/if}
			</Field.Root>
			<Field.Root required invalid={submitted && !contactEmail}>
				<Field.Label>Email</Field.Label>
				<Field.Input bind:value={contactEmail} type="email" placeholder="jane@example.com" />
				{#if submitted && !contactEmail}
					<Field.ErrorText>Email is required.</Field.ErrorText>
				{/if}
			</Field.Root>
			<Field.Root>
				<Field.Label>Message</Field.Label>
				<Field.Textarea bind:value={contactMessage} placeholder="Your message..." rows={3} />
			</Field.Root>
			{#if submitted && (!contactName || !contactEmail)}
				<Fieldset.ErrorText>Please fill in all required fields.</Fieldset.ErrorText>
			{/if}
			<button
				class="text-primary-fg mt-1 rounded-md bg-primary px-4 py-2 text-sm font-medium hover:bg-primary/90"
				onclick={() => (submitted = !submitted)}
			>
				Submit
			</button>
		</Fieldset.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Disabled Fieldset</h2>
		<Fieldset.Root disabled>
			<Fieldset.Legend>Account Settings</Fieldset.Legend>
			<Fieldset.HelperText>Contact support to update these settings.</Fieldset.HelperText>
			<Field.Root>
				<Field.Label>Username</Field.Label>
				<Field.Input value="johndoe" />
			</Field.Root>
			<Field.Root>
				<Field.Label>Email</Field.Label>
				<Field.Input value="john@example.com" type="email" />
			</Field.Root>
		</Fieldset.Root>
	</section>
</div>
