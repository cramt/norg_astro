import Module from "node:module";

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
  hello: () => string;
};

export default native;
