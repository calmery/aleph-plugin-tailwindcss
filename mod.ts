import type { Plugin } from "https://deno.land/x/aleph@v0.3.0-beta.19/types.d.ts";
import type { RequiredConfig } from "https://deno.land/x/aleph@v0.3.0-beta.19/server/config.ts";
import * as path from "https://deno.land/std@0.110.0/path/mod.ts";

// Types

type Aleph = Parameters<Plugin["setup"]>[0] & { config: RequiredConfig };

// Constants

const baseDir = new URL(".", import.meta.url).pathname;
const nodeDir = path.resolve(baseDir, "./node/");

// State

const styles: { [key: string]: string } = {};

// Helper Functions

const webpack = (aleph: Aleph, options: {
  watch: boolean;
}) => {
  return Deno.run({
    cmd: [
      "npx",
      "webpack",
      "--config",
      path.resolve(nodeDir, "./webpack.config.js"),
    ].concat(options.watch ? ["--watch"] : []),
    env: {
      _ALEPH_PLUGIN_EMOTION_BASE_DIRECTORY: baseDir,
      _ALEPH_PLUGIN_EMOTION_MODE: aleph.mode,
      _ALEPH_PLUGIN_EMOTION_SOURCE_DIRECTORY: path.resolve(
        aleph.workingDir,
        `.${aleph.config.srcDir}`,
      ),
      _ALEPH_PLUGIN_EMOTION_WORKING_DIRECTORY: aleph.workingDir,
    },
    stderr: "null",
    stdout: "null",
  }).status();
};

// Main

export default <Plugin> {
  name: "emotion",
  async setup(
    aleph: Aleph,
  ) {
    await webpack(aleph, { watch: false });

    // Events

    aleph.onTransform(/\/pages\/.+.tsx$/, async ({ module: { specifier } }) => {
      const css = new TextDecoder().decode(
        await Deno.run({
          cmd: [
            "node",
            path.resolve(nodeDir, "./output/", `./${specifier}.js`),
          ],
          stdout: "piped",
        }).output(),
      );

      styles[specifier] = css;
    });

    aleph.onRender(({ html }) => {
      html.head.push(
        `<style data-emotion>${Object.values(styles).join("")}</style>`,
      );
    });

    // In development mode

    if (aleph.mode === "development") {
      webpack(aleph, { watch: true });
    }
  },
};
