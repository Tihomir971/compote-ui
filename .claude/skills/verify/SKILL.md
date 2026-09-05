---
name: verify
description: Run tests, type-checking and linting to validate the current state of the codebase. Use after making changes before committing.
---

Run the following commands in sequence and report any errors:

```
bun run test && bun run check && bun run lint
```

- `bun run test` runs `vitest run` — unit tests for `src/lib/utils/` plus SSR contract tests that
  assert what the components actually render (e.g. that date components submit ISO strings).
- `bun run check` runs `svelte-kit sync && svelte-check` for TypeScript and Svelte type errors.
- `bun run lint` runs `prettier --check . && eslint .` for formatting and lint errors.

If any command fails, show the relevant error output and suggest fixes.
