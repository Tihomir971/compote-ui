<script lang="ts">
	import { Menu } from '$lib';

	let checked = $state(false);
	let radioValue = $state('light');
</script>

<div class="space-y-5 *:rounded-xl *:border *:border-surface-3 *:bg-surface-1 *:p-4">
	<section>
		<h2 class="mb-4 text-lg font-semibold">Basic Menu</h2>
		<Menu.Root>
			<Menu.Trigger variant="outline">
				Menu
				<Menu.Indicator />
			</Menu.Trigger>
			<Menu.Content>
				<Menu.Item value="new-file">New File</Menu.Item>
				<Menu.Item value="new-window">New Window</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="save">Save</Menu.Item>
				<Menu.Item value="save-as">Save As...</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="quit" disabled>Quit</Menu.Item>
			</Menu.Content>
		</Menu.Root>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Menu with Groups</h2>
		<Menu.Root>
			<Menu.Trigger variant="outline">Options</Menu.Trigger>
			<Menu.Content>
				<Menu.ItemGroup>
					<Menu.ItemGroupLabel>Appearance</Menu.ItemGroupLabel>
					<Menu.CheckboxItem
						{checked}
						onCheckedChange={(details) => (checked = details)}
						value="show-sidebar"
					>
						Show Sidebar
					</Menu.CheckboxItem>
					<Menu.CheckboxItem
						{checked}
						onCheckedChange={(details) => (checked = details)}
						value="show-status-bar"
					>
						Show Status Bar
					</Menu.CheckboxItem>
				</Menu.ItemGroup>
				<Menu.Separator />
				<Menu.ItemGroup>
					<Menu.ItemGroupLabel>Theme</Menu.ItemGroupLabel>
					<Menu.RadioItemGroup
						value={radioValue}
						onValueChange={(details) => (radioValue = details.value)}
					>
						<Menu.RadioItem value="light">Light</Menu.RadioItem>
						<Menu.RadioItem value="dark">Dark</Menu.RadioItem>
						<Menu.RadioItem value="system">System</Menu.RadioItem>
					</Menu.RadioItemGroup>
				</Menu.ItemGroup>
			</Menu.Content>
		</Menu.Root>
		<p class="mt-3 text-sm text-ink-dim">Selected theme: {radioValue}</p>
	</section>

	<section>
		<h2 class="mb-4 text-lg font-semibold">Context Menu</h2>
		<Menu.Root>
			<Menu.ContextTrigger>
				<div class="rounded-lg border border-surface-3 bg-surface-1 p-8 text-center">
					Right-click here to open context menu
				</div>
			</Menu.ContextTrigger>
			<Menu.Content>
				<Menu.Item value="cut">Cut</Menu.Item>
				<Menu.Item value="copy">Copy</Menu.Item>
				<Menu.Item value="paste">Paste</Menu.Item>
				<Menu.Separator />
				<Menu.Item value="select-all">Select All</Menu.Item>
			</Menu.Content>
		</Menu.Root>
	</section>
</div>
