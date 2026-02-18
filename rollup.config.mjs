import fs from "fs";
import json from "@rollup/plugin-json";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import uglify from "@lopatnov/rollup-plugin-uglify";

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
];

const configs = [];

fs.readdirSync("./src").forEach((file) => {
  const fileName = file.split(".").slice(0, -1).join(".");
  const filePath = `./src/${file}`;
  const cjsTarget = `dist/${fileName}.cjs`;
  const esmTarget = `dist/${fileName}.esm.mjs`;
  const umdTarget = `dist/${fileName}.umd.js`;
  const umdTargetMin = `dist/${fileName}.umd.min.js`;

  // CJS + ESM + UMD (with declarations and sourcemaps)
  configs.push({
    input: filePath,
    output: [
      {
        file: cjsTarget,
        format: "cjs",
        sourcemap: true,
        exports: "default"
      },
      {
        file: esmTarget,
        format: "es",
        sourcemap: true
      },
      {
        file: umdTarget,
        format: "umd",
        name: pkg.umdName,
        sourcemap: true,
        exports: "default"
      }
    ],
    external,
    plugins: [
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "dist",
        sourceMap: true,
        outDir: "dist"
      }),
      resolve(),
      commonjs()
    ]
  });

  // Minified UMD (separate pass — uglify cannot run alongside multi-output)
  configs.push({
    input: filePath,
    output: {
      file: umdTargetMin,
      format: "umd",
      name: pkg.umdName,
      sourcemap: false,
      exports: "default"
    },
    external,
    plugins: [
      json(),
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        sourceMap: false,
        outDir: "dist"
      }),
      resolve(),
      commonjs(),
      uglify()
    ]
  });
});

export default configs;
