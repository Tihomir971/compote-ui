---
name: build-lib
description: Build and publish the library package to npm. Runs prepack (svelte-package + publint) automatically, then publishes.
---

To publish the library to npm:

```
npm publish
```

This automatically runs the `prepack` lifecycle hook (`svelte-kit sync && svelte-package && publint`) before publishing, so no separate build step is needed.

If you only want to build and validate without publishing, run:

```
bun run prepack
```

If `publint` reports issues, fix them before publishing. Check that `src/lib/index.ts` exports all intended components before publishing.
