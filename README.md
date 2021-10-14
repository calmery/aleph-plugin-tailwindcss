# @calmery-chan/aleph-plugin-tailwindcss

[![@calmery-chan/aleph-plugin-tailwindcss - npm](https://img.shields.io/npm/v/@calmery-chan/aleph-plugin-tailwindcss.svg)](https://www.npmjs.com/package/@calmery-chan/aleph-plugin-tailwindcss)
[![Lint](https://github.com/calmery-chan/aleph-plugin-tailwindcss/actions/workflows/lint.yml/badge.svg?branch=develop)](https://github.com/calmery-chan/aleph-plugin-tailwindcss/actions/workflows/lint.yml)
[![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

A plugin for using Tailwind CSS with Aleph.js.

## Usage

Please install Node.js and run it.

```ts
// aleph.config.ts

import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import tailwindcss from "https://deno.land/x/calmery_chan_aleph_plugin_tailwindcss@v1.1.1/mod.ts";

export default <Config> {
  plugins: [tailwindcss],
};
```

```tsx
// tailwind.config.js

module.exports = {
  purge: ["./src/**/*.tsx"],
};
```

See [example](./example/).
