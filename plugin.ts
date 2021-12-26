import type { Plugin } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import type { RequiredConfig } from "https://deno.land/x/aleph@v0.3.0-beta.19/server/config.ts";
import * as semver from "https://deno.land/x/semver@v1.4.0/mod.ts";
import * as colors from "https://deno.land/std@0.110.0/fmt/colors.ts";
import * as fs from "https://deno.land/std@0.110.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.110.0/path/mod.ts";

// Constants

const DEFAULT_VERSION = "^3.0.7";

// Types

type Aleph = Parameters<Plugin["setup"]>[0] & { config: RequiredConfig };

// Helper Functions

const log = (...messages: string[]) => {
  console.log(colors.blue("Tailwind CSS"), ...messages);
};

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

interface PluginOptions {
  version?: string;
}

const tailwindcss = ({ version }: PluginOptions): Plugin => {
  return {
    name: "tailwindcss",
    async setup(aleph: Aleph) {
      // Check if this plugin is compatible with the current version of npm.

      const npmVersion = new TextDecoder().decode(
        await (await Deno.run({ cmd: ["npm", "--version"], stdout: "piped" }))
          .output(),
      ).replace(/\r?\n/g, "");

      if (!semver.gt(npmVersion, "7.0.0")) {
        throw new Error("This plugin requires npm version 7.0.0 or higher.");
      }

      //

      if (version && !semver.validRange(version)) {
        throw new Error("Invalid version.");
      }

      //

      const tailwindConfigJs = path.resolve(
        aleph.workingDir,
        "./tailwind.config.js",
      );

      if (!(await fs.exists(tailwindConfigJs))) {
        log(
          "The process was aborted because tailwind.config.js does not exist.",
        );
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
        log("render", path);
      });

      // Helper Functions

      const build = (options: { watch: boolean }) => {
        return Deno.run({
          cmd: [
            "npm",
            "exec",
            "--yes",
            "--",
            `tailwindcss@${version ?? DEFAULT_VERSION}`,
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
        log("Start watching code changes...");
      }
    },
  };
};

const defaultConfiguration = tailwindcss({ version: DEFAULT_VERSION });
tailwindcss.setup = defaultConfiguration.setup;

export default tailwindcss;
