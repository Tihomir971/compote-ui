<script lang="ts">
	import { Field } from '$lib';
	import PhMagnifyingGlass from '$lib/icons/PhMagnifyingGlass.svelte';
	import PhX from '$lib/icons/PhX.svelte';
	let fieldName = $state('');
	let fieldEmail = $state('');
	let fieldBio = $state('');
	let fieldInvalidEmail = $state('invalid-email');
	let fieldSearch = $state('');
	let fieldUsername = $state('');
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Field Inputs</h2>
		<div class="flex flex-col gap-4">
			<Field.Root>
				<Field.Label>Name</Field.Label>
				<Field.Input bind:value={fieldName} placeholder="John Doe" />
			</Field.Root>

			<Field.Root>
				<Field.Label>Search</Field.Label>
				<Field.Input bind:value={fieldSearch} placeholder="Search...">
					{#snippet startIcon()}
						<PhMagnifyingGlass class="size-4" />
					{/snippet}
				</Field.Input>
			</Field.Root>
			<Field.Root>
				<Field.Label>Username</Field.Label>
				<Field.Input bind:value={fieldUsername} placeholder="johndoe">
					{#snippet endIcon()}
						{#if fieldUsername}
							<button onclick={() => (fieldUsername = '')} class="text-ink-dim hover:text-ink">
								<PhX class="size-4" />
							</button>
						{/if}
					{/snippet}
				</Field.Input>
			</Field.Root>

			<Field.Root>
				<Field.Label>Email</Field.Label>
				<Field.Input bind:value={fieldEmail} type="email" placeholder="you@example.com" />
				<Field.HelperText>We'll never share your email with anyone else.</Field.HelperText>
			</Field.Root>

			<Field.Root>
				<Field.Label>Bio</Field.Label>
				<Field.Textarea
					bind:value={fieldBio}
					placeholder="Tell us a little about yourself..."
					rows={4}
				/>
				<Field.HelperText>Keep it under 500 characters.</Field.HelperText>
			</Field.Root>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Field States</h2>
		<div class="flex flex-col gap-4">
			<Field.Root invalid>
				<Field.Label>Email</Field.Label>
				<Field.Input
					bind:value={fieldInvalidEmail}
					type="email"
					placeholder="you@example.com"
					aria-invalid="true"
				/>
				<Field.ErrorText>Please enter a valid email address.</Field.ErrorText>
			</Field.Root>

			<Field.Root disabled>
				<Field.Label>Username</Field.Label>
				<Field.Input value="johndoe" placeholder="username" />
				<Field.HelperText>This field is disabled.</Field.HelperText>
			</Field.Root>

			<Field.Root readOnly>
				<Field.Label>Account ID</Field.Label>
				<Field.Input value="acc_1a2b3c4d" />
				<Field.HelperText>This field is read-only.</Field.HelperText>
			</Field.Root>
		</div>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Required Fields</h2>
		<div class="flex flex-col gap-4">
			<Field.Root required>
				<Field.Label>First Name</Field.Label>
				<Field.Input placeholder="Jane" />
			</Field.Root>

			<Field.Root required invalid>
				<Field.Label>Password</Field.Label>
				<Field.Input type="password" placeholder="••••••••" />
				<Field.ErrorText>Password is required.</Field.ErrorText>
			</Field.Root>
		</div>
	</section>
</div>
