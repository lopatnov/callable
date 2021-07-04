import fs from "fs";
import json from "rollup-plugin-json";
import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import uglify from "@lopatnov/rollup-plugin-uglify";

import pkg from "./package.json";

const configs = [];
fs.readdirSync('./src').forEach(file => {
  const fileName = file.split('.').slice(0, -1).join('.');
  const filePath = `./src/${file}`;
  const umdTarget = `dist/${fileName}.js`;
  const umdTargetMin = `dist/${fileName}.min.js`;
  const esTarget = `dist/${fileName}.es.js`;
  configs.push({
    input: filePath,
    output: [
      {
        file: umdTarget,
        format: "umd",
        name: pkg.umdName,
        sourcemap: true
      },
      {
        file: esTarget,
        format: "es",
        sourcemap: true
      }
    ],
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      json(),
      typescript({
        typescript: require("typescript")
      }),
      resolve(),
      commonjs()
    ]
  });

  configs.push({
    input: filePath,
    output: {
      file: umdTargetMin,
      name: pkg.umdName,
      format: "umd"
    },
    external: [
      ...Object.keys(pkg.devDependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      json(),
      typescript({
        typescript: require("typescript")
      }),
      resolve(),
      commonjs(),
      uglify()
    ]
  });
});

export default configs;
