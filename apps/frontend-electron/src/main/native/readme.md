# Native Node.js Modules for Electron

This directory contains native Node.js binaries (`.node` files) and related code that will be used by the Electron main process.

## Purpose

Native modules are compiled C/C++ code that can be used from Node.js (and therefore Electron's main process). They are used for:

1. Performance-critical operations
2. Low-level system access
3. Integration with platform-specific libraries
4. Operations that can't be done efficiently in JavaScript

## Usage

To use native modules in the Electron main process:

1. Place `.node` files in this directory
2. Create TypeScript wrapper files that provide type-safe interfaces
3. Export the functionality from this directory's index.ts file
4. Import and use the modules from the main process code

## Rebuilding Native Modules

Native modules must be rebuilt for the specific Electron version you're using. Use the following command:

```bash
npx electron-rebuild --version=[ELECTRON_VERSION] --module-dir=libs/electron-main
```

## Security Considerations

Native modules run with the same permissions as the Electron process. Always:

1. Validate all inputs before passing to native code
2. Only use trusted modules from reliable sources
3. Keep native modules updated for security patches
4. Never expose native functionality directly to the renderer process
