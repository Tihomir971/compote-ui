---
name: verify
description: Run type-checking and linting to validate the current state of the codebase. Use after making changes before committing.
---

Run the following commands in sequence and report any errors:

```
bun run check && bun run lint
```

- `bun run check` runs `svelte-kit sync && svelte-check` for TypeScript and Svelte type errors.
- `bun run lint` runs `prettier --check . && eslint .` for formatting and lint errors.

If either command fails, show the relevant error output and suggest fixes.
