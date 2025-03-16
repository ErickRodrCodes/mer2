// Nx Electron plugin for vite
import { startup } from 'vite-plugin-electron';
import electron from 'vite-plugin-electron/simple';
import waitOn from 'wait-on';

import { join, resolve } from 'path';
import { existsSync, rmSync } from 'fs';
import { Plugin, UserConfig } from 'vite';

const workspaceRoot = process.cwd();
const projectRoot = __dirname;

rmSync(join(projectRoot, 'dist'), { recursive: true, force: true });

export async function electronNxViteConfig() {
  return await electron({
    main: {
      entry: resolve(projectRoot, 'src/main/main.ts'),
      onstart: () => {
        startup([
          '--inspect=5858',
          '--enable-logging',
          '--log-level=0',
          resolve(workspaceRoot, 'dist/apps/frontend-electron/main.js'),
        ]);
      },
      vite: {
        build: {
          outDir: resolve(workspaceRoot, 'dist/apps/frontend-electron'),
          sourcemap: true,
          rollupOptions: {
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
            },
          },
        },
      },
    },
    preload: {
      input: resolve(projectRoot, 'src/preload/preload.ts'),
      vite: withDebug({
        build: {
          outDir: resolve(workspaceRoot, 'dist/apps/frontend-electron'),
          sourcemap: 'inline',
          rollupOptions: {
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
            },
          },
        },
      }),
    },
    // Ployfill the Electron and Node.js API for Renderer process.
    // If you want use Node.js in Renderer process, the `nodeIntegration` needs to be enabled in the Main process.
    // See 👉 https://github.com/electron-vite/vite-plugin-electron-renderer
    renderer: process.env.NODE_ENV === 'test' ? undefined : {},
  });
}

/**
 * This function will redirect the electron window to the given URL when it is available.
 * @param url the url of the guest frontend application
 * @param timeout a timeout to wait for the application to be available. Default is 50000ms
 */
export function redirectWhenAvailable(url: string, timeout = 50000) {
  return {
    name: 'redirect-middleware',
    async configureServer(server) {
      try {
        await waitOn({
          resources: [`${url}`],
          timeout,
          log: false,
        });
        console.log(
          `\n🚀 Frontend application ${url} is available. Preparing electron to host Target Project.\n`
        );
      } catch (err) {
        console.error(`Error: unable to perform operation:`, err.message);
        process.exit(1);
      }

      server.middlewares.use((req, res, next) => {
        if (
          req?.url?.startsWith('/__vite_ping') ||
          req?.url?.startsWith('/@vite')
        ) {
          return next();
        }
        res.writeHead(302, { Location: `${url}${req.url}` });
        res.end();
      });
    },
  };
}

/**
 * A function that enabled debugging capabilities
 */
export function withDebug(config: UserConfig): UserConfig {
  const debugFile = join(__dirname, 'node_modules/.electron-vite-debug');
  const isDebug = existsSync(debugFile);

  if (isDebug) {
    // Ensure config.build is defined
    config.build = config.build || {};
    config.build.sourcemap = true;
    config.plugins = (config.plugins || []).concat({
      name: 'electron-vite-debug',
      configResolved(config) {
        // TODO: when the next version of `vite-plugine-electron` is released, use the config hook.
        const index = config.plugins.findIndex(
          (p) => p.name === 'electron-main-watcher'
        );
        (config.plugins as Plugin[]).splice(index, 1);
        rmSync(debugFile);
      },
    });
  }

  return config;
}

export default electronNxViteConfig;
