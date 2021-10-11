import type { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import emotion from "./node_modules/@calmery-chan/aleph-plugin-emotion/mod.ts";

export default <Config> {
  plugins: [emotion],
};
