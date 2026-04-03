<script lang="ts">
	import { Tabs } from '$lib';
	import PaletteTab from './contents/PaletteTab.svelte';
	import ButtonTab from './contents/ButtonTab.svelte';
	import CarouselTab from './contents/CarouselTab.svelte';
	import CheckboxTab from './contents/CheckboxTab.svelte';
	import ComboboxTab from './contents/ComboboxTab.svelte';
	import DialogTab from './contents/DialogTab.svelte';
	import FieldTab from './contents/FieldTab.svelte';
	import FieldsetTab from './contents/FieldsetTab.svelte';
	import FileUploadTab from './contents/FileUploadTab.svelte';
	import ImageCropperTab from './contents/ImageCropperTab.svelte';
	import ListboxTab from './contents/ListboxTab.svelte';
	import MenuTab from './contents/MenuTab.svelte';
	import NumberInputTab from './contents/NumberInputTab.svelte';
	import SelectTab from './contents/SelectTab.svelte';
	import SplitterTab from './contents/SplitterTab.svelte';
	import SwitchTab from './contents/SwitchTab.svelte';
	import TreeViewTab from './contents/TreeViewTab.svelte';
</script>

<div class="mx-auto min-h-screen max-w-1/2 p-8">
	<Tabs.Root defaultValue="button" indicator orientation="vertical">
		{#snippet triggers()}
			<Tabs.Trigger value="palette">Palette</Tabs.Trigger>
			<Tabs.Trigger value="button">Button</Tabs.Trigger>
			<Tabs.Trigger value="carousel">Carousel</Tabs.Trigger>
			<Tabs.Trigger value="checkbox">Checkbox</Tabs.Trigger>
			<Tabs.Trigger value="combobox">Combobox</Tabs.Trigger>
			<Tabs.Trigger value="dialog">Dialog</Tabs.Trigger>
			<Tabs.Trigger value="field">Field</Tabs.Trigger>
			<Tabs.Trigger value="fieldset">Fieldset</Tabs.Trigger>
			<Tabs.Trigger value="file-upload">File Upload</Tabs.Trigger>
			<Tabs.Trigger value="image-cropper">Image Cropper</Tabs.Trigger>
			<Tabs.Trigger value="listbox">Listbox</Tabs.Trigger>
			<Tabs.Trigger value="menu">Menu</Tabs.Trigger>
			<Tabs.Trigger value="number-input">Number Input</Tabs.Trigger>
			<Tabs.Trigger value="select">Select</Tabs.Trigger>
			<Tabs.Trigger value="splitter">Splitter</Tabs.Trigger>
			<Tabs.Trigger value="switch">Switch</Tabs.Trigger>
			<Tabs.Trigger value="tree-view">Tree View</Tabs.Trigger>
		{/snippet}

		<Tabs.Content value="palette">
			<PaletteTab />
		</Tabs.Content>

		<Tabs.Content value="button">
			<ButtonTab />
		</Tabs.Content>

		<Tabs.Content value="carousel">
			<CarouselTab />
		</Tabs.Content>

		<Tabs.Content value="checkbox">
			<CheckboxTab />
		</Tabs.Content>

		<Tabs.Content value="combobox">
			<ComboboxTab />
		</Tabs.Content>

		<Tabs.Content value="dialog">
			<DialogTab />
		</Tabs.Content>

		<Tabs.Content value="field">
			<FieldTab />
		</Tabs.Content>

		<Tabs.Content value="fieldset">
			<FieldsetTab />
		</Tabs.Content>

		<Tabs.Content value="file-upload">
			<FileUploadTab />
		</Tabs.Content>

		<Tabs.Content value="image-cropper">
			<ImageCropperTab />
		</Tabs.Content>

		<Tabs.Content value="listbox">
			<ListboxTab />
		</Tabs.Content>

		<Tabs.Content value="menu">
			<MenuTab />
		</Tabs.Content>

		<Tabs.Content value="number-input">
			<NumberInputTab />
		</Tabs.Content>

		<Tabs.Content value="select">
			<SelectTab />
		</Tabs.Content>

		<Tabs.Content value="splitter">
			<SplitterTab />
		</Tabs.Content>

		<Tabs.Content value="switch">
			<SwitchTab />
		</Tabs.Content>

		<Tabs.Content value="tree-view">
			<TreeViewTab />
		</Tabs.Content>
	</Tabs.Root>
</div>
