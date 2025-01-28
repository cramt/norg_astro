import Module from "node:module";
import * as fs from "node:fs";
import type { Loader, LoaderContext } from "astro/loaders";

const require = Module.createRequire(import.meta.url);

const native = require("@neon-rs/load").proxy({
  platforms: {
    "win32-x64-msvc": () => require("@norg_astro/win32-x64-msvc"),
    "darwin-x64": () => require("@norg_astro/darwin-x64"),
    "darwin-arm64": () => require("@norg_astro/darwin-arm64"),
    "linux-x64-gnu": () => require("@norg_astro/linux-x64-gnu"),
    "linux-arm64-gnu": () => require("@norg_astro/linux-arm64-gnu"),
  },
  debug: () => require("../index.node"),
}) as {
  build: (norg: string) => string;
};

export const loader = (dir: string): Loader => {
  return {
    name: "norg",
    load: async (context: LoaderContext) => {
      const result = (
        await Promise.all(
          (
            await fs.promises.readdir(dir, {
              recursive: true,
            })
          )
            .filter((x) => x.endsWith(".norg"))
            .map((x) => [x.replace(".norg", ""), dir + "/" + x])
            .map(async ([name, path]) => [
              name,
              await fs.promises.readFile(path),
            ]),
        )
      ).map(([k, v]) => [k, JSON.parse(native.build(v.toString("utf8")))]);
      result.forEach(([id, data]) =>
        context.store.set({
          id,
          data,
          rendered: {
            html: data.html,
            metadata: { frontmatter: data.metadata },
          },
          digest: context.generateDigest(data),
        }),
      );
    },
  };
};
