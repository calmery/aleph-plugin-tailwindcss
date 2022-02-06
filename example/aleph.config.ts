import { Config } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import tailwindcss from "../plugin.ts";

export default <Config> {
  plugins: [tailwindcss],
};

// Set the version of Tailwind CSS to use.
// export default <Config> {
//   plugins: [tailwindcss({ version: "3.0.18" })],
// };

// If it does not work properly, try running it with the following option.
// export default <Config> {
//   plugins: [tailwindcss({ verbose: true })],
// };
