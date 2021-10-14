import type { Plugin } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import type { RequiredConfig } from "https://deno.land/x/aleph@v0.3.0-beta.19/server/config.ts";
import * as fs from "https://deno.land/std@0.110.0/fs/mod.ts";
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
    const tailwindConfigJs = path.resolve(
      aleph.workingDir,
      "./tailwind.config.js",
    );

    if (!(await fs.exists(tailwindConfigJs))) {
      return;
    }

    // Input

    const inputFilePath = await Deno.makeTempFile();
    const outputFilePath = await Deno.makeTempFile();

    await Deno.writeFile(
      inputFilePath,
      new TextEncoder().encode(`
@tailwind base;
@tailwind components;
@tailwind utilities;
      `),
    );

    // Events

    aleph.onRender(({ html, path }) => {
      html.head.push(`<style>${style}</style>`);
    });

    // Helper Functions

    const build = (options: { watch: boolean }) => {
      return Deno.run({
        cmd: [
          "npm",
          "exec",
          "--yes",
          "--",
          "tailwindcss@2.2.17",
          "build",
          "--config",
          tailwindConfigJs,
          "--input",
          inputFilePath,
          "--output",
          outputFilePath,
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
