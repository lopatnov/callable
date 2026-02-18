/** @type {import('jest').Config} */
module.exports = {
  clearMocks: true,
  coverageDirectory: "coverage",
  roots: ["tests"],
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }]
  },
  // Map extension-less dist imports to .cjs at runtime.
  // TypeScript resolves types from the matching .d.ts file (same base name).
  moduleNameMapper: {
    "^(\\.{1,2}/dist/\\w+)$": "$1.cjs"
  }
};
