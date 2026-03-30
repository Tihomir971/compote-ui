# Compote UI

An opinionated UI component library for Svelte, built on top of [Ark UI](https://ark-ui.com) with additional components and features not available in the core Ark UI library.

## About

Compote UI provides a set of accessible, customizable, and well-styled UI components for Svelte applications. While Ark UI offers excellent headless components with robust accessibility, Compote UI goes a step further by:

- **Opinionated defaults** with sensible styling out of the box
- **Additional components** that fill gaps in the Ark UI ecosystem
- **Tailwind CSS integration** for easy customization
- **TypeScript support** with full type definitions
- **Accessibility-first** approach, building on Ark UI's strong foundation

## Installation

```bash
npm install compote-ui
```

Or with other package managers:

```bash
pnpm add compote-ui
yarn add compote-ui
bun add compote-ui
```

## Peer Dependencies

Compote UI requires Svelte 5 or later:

## Quick Start

```svelte
<script>
	import { Button, Card } from 'compote-ui';
</script>

<Card>
	<h1>Hello from Compote UI</h1>
	<Button variant="primary">Click me</Button>
</Card>
```

## Features

- ✅ **Built on Ark UI** - Leveraging battle-tested accessible primitives
- 🎨 **Tailwind CSS** - Easy theming and customization
- 🔧 **TypeScript** - Full type safety and autocomplete
- ♿ **Accessible** - WCAG compliant components
- 🚀 **Svelte 5** - Modern Svelte with runes and enhanced reactivity
- 📦 **Tree-shakeable** - Only bundle what you use

## Components

Compote UI includes all Ark UI components plus additional components:

### From Ark UI

- Accordion, Avatar, Checkbox, Collapsible, Combobox, Dialog, Dropdown Menu, Hover Card, Menu, Pagination, Popover, Progress, Radio Group, Select, Slider, Switch, Tabs, Toast, Toggle, Tooltip, and more...

### Additional Components

- _Additional components that extend Ark UI functionality_
- _Custom styled variants with opinionated defaults_

## Theming

Compote UI uses Tailwind CSS, making it easy to customize the appearance to match your brand:

## License

MIT

## Links

- [GitHub](https://github.com/@tihomir971/compote-ui)
- [Issues](https://github.com/@tihomir971/compote-ui/issues)
