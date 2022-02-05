# aleph-plugin-tailwindcss

[![@calmery-chan/aleph-plugin-tailwindcss - npm](https://img.shields.io/npm/v/@calmery-chan/aleph-plugin-tailwindcss.svg)](https://www.npmjs.com/package/@calmery-chan/aleph-plugin-tailwindcss)
[![Lint](https://github.com/calmery-chan/aleph-plugin-tailwindcss/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/calmery-chan/aleph-plugin-tailwindcss/actions/workflows/lint.yml)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A plugin for using Tailwind CSS with Aleph.js.

## Usage

First, install Node.js version 15.0.0 or higher (technically, npm version 7.0.0
or higher).

```ts
// aleph.config.ts

import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import tailwindcss from "https://deno.land/x/aleph_plugin_tailwindcss/plugin.ts";

export default <Config> {
  plugins: [tailwindcss],
  // plugins: [tailwindcss({ version: "3.0.18" })],
};
```

```tsx
// tailwind.config.js

module.exports = {
  content: ["./src/**/*.tsx"],
};
```

See [example](./example/).
