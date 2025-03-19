const esbuild = require("esbuild");
const lv_vsn = require("./package.json").version.split("lv")[1];

const commonOptions = {
  bundle: true,
  format: "esm",
  define: {
    LV_VSN: `"${lv_vsn}"`,
  },
};

async function build() {
  try {
    await esbuild.build({
      entryPoints: ["./assets/phoenix_live_view/js/phoenix_live_view/"],
      sourcemap: true,
      outfile: "assets/js/dist/phoenix_live_view.js",
      ...commonOptions,
    });

    await esbuild.build({
      entryPoints: ["./assets/js/live_view_portal/portal.js"],
      target: "es2016",
      globalName: "LiveViewPortal",
      minify: true,
      outfile: `assets/js/dist/live_view_portal.min.js`,
      ...commonOptions,
    });

    await esbuild.build({
      entryPoints: ["./assets/js/live_view_portal/portal.js"],
      target: "es2016",
      globalName: "LiveViewPortal",
      sourcemap: true,
      outfile: `assets/js/dist/live_view_portal.js`,
      ...commonOptions,
    });

    console.log("Build completed successfully!");
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();
