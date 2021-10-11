import type { Plugin } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import type { RequiredConfig } from "https://deno.land/x/aleph@v0.3.0-beta.19/server/config.ts";
import * as path from "https://deno.land/std@0.110.0/path/mod.ts";

// Types

type Aleph = Parameters<Plugin["setup"]>[0] & { config: RequiredConfig };

// Helper Functions

const watch = async (filePath: string, callback: (string: string) => void) => {
  const watcher = Deno.watchFs(filePath);

  for await (const event of watcher) {
    if (event.kind === "modify") {
      callback(
        new TextDecoder().decode(await Deno.readFile(filePath)),
      );
    }
  }
};

// State

let style = "";

// Main

export default <Plugin> {
  name: "tailwindcss",
  async setup(aleph: Aleph) {
    const inputFilePath = await Deno.makeTempFile();
    const outputFilePath = await Deno.makeTempFile();

    // Input

    await Deno.writeFile(
      inputFilePath,
      new TextEncoder().encode(`
@tailwind base;
@tailwind components;
@tailwind utilities;
      `),
    );

    // Events

    aleph.onRender(({ html }) => {
      html.head.push(`<style>${style}</style>`);
    });

    // Helper Functions

    const build = (options: { watch: boolean }) => {
      return Deno.run({
        cmd: [
          "npx",
          "tailwindcss",
          "build",
          "--input",
          inputFilePath,
          "--output",
          outputFilePath,
          "--purge",
          path.resolve(
            aleph.workingDir,
            `.${aleph.config.srcDir}`,
            "./**/*.tsx",
          ),
        ].concat(
          aleph.mode === "production" ? ["--minify"] : [],
          options.watch ? ["--watch"] : [],
        ),
        stdout: "null",
        stderr: "null",
      });
    };

    // Main

    await build({ watch: false }).status();
    style = new TextDecoder().decode(await Deno.readFile(outputFilePath));

    if (aleph.mode === "development") {
      watch(outputFilePath, (string) => style = string);
      build({ watch: true });
    }
  },
};
