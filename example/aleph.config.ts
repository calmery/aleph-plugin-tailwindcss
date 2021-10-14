import { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import tailwindcss from "../plugin.ts";

export default <Config> {
  plugins: [tailwindcss],
};
