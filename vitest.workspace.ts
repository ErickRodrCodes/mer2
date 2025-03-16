import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "libs/**/*/vite.config.ts",
  "apps/**/*/vite.config.ts",
  "!libs/spartan-ui/**/*",
])
