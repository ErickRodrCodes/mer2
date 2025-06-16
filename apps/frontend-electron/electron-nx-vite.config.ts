// Nx Electron plugin for vite
import { startup } from 'vite-plugin-electron';
import electron from 'vite-plugin-electron/simple';
import waitOn from 'wait-on';

import { copyFileSync, existsSync, readFileSync, rmSync } from 'fs';
import { basename, join, resolve } from 'path';
import { Plugin, UserConfig, createLogger } from 'vite';

const workspaceRoot = process.cwd();
const projectRoot = __dirname;
const logger = createLogger('info', {
  prefix: '[Nx Electron Vite Plugin]',
});

const pkg =  JSON.parse(readFileSync(resolve(workspaceRoot, 'package.json'), 'utf-8'));
const dependencies = Object.keys('dependencies' in pkg ? pkg.dependencies : {});

function cleanDist(): Plugin {
  return {
    name: 'clean-dist',
    buildStart() {
      // const distPath = resolve(workspaceRoot, 'dist/frontend-app');
      // if (existsSync(distPath)) {
      //   logger.info('🗑️  Removing dist folder: ' + distPath, {
      //     timestamp: true,
      //   });
      //   try {
      //     rimraf.sync(distPath);
      //   } catch {
      //     logger.error('⛔ Failed to remove dist folder: ' + distPath, {
      //       timestamp: true,
      //     });
      //     logger.error('⛔ Resource is busy and cannot be removed.', {
      //       timestamp: true,
      //     });
      //   }
      // }
    },
    closeBundle() {
      // Do nothing - we don't want to clean after build
    }
  };
}

function copyNative(natives: { pathReference: string }): Plugin {
  return {
    name: 'copy-native',
    closeBundle() {
      const referenceFile = resolve(natives.pathReference);
      const referenceFileContent: {
        [key: string]: { path: string; version: string };
      } = JSON.parse(readFileSync(referenceFile, 'utf-8'));
      const nativesToCopy = Object.keys(referenceFileContent);
      const results: { native: string; distPath: string; version: string }[] =
        [];
      const alreadyCopied: string[] = [];

      for (const native of nativesToCopy) {
        const distPath = resolve(workspaceRoot, 'dist/apps/frontend-electron');
        const nativePath = resolve(
          projectRoot,
          'src/main/native',
          referenceFileContent[native].path
        );

        const getFileNameFromNativePath = basename(nativePath);
        try {
          copyFileSync(nativePath, `${distPath}/${getFileNameFromNativePath}`);
          results.push({
            native,
            distPath,
            version: referenceFileContent[native].version,
          });
        } catch (e) {
          logger.error(
            `⛔ Native module ${native} is being used at the moment. More likely it is already copied.`,
            {
              timestamp: true,
            }
          );
          alreadyCopied.push(native);
        }
      }
      if (results.length > 0) {
        logger.info('Native modules copied:', {
          timestamp: true,
        });
        results.forEach((result) => {
          logger.info(
            `📦 ${result.native} (${result.version}) → ${result.distPath}`,
            {
              timestamp: true,
            }
          );
        });
        logger.info(`📜 Total: ${results.length} modules`, {
          timestamp: true,
        });
      } else if (alreadyCopied.length > 0) {
        alreadyCopied.forEach((result) => {
          logger.info(
            `⚠️  Native module ${result} was already copied. skipping...`,
            {
              timestamp: true,
            }
          );
        });
      } else {
        logger.warn(
          '✅  No native modules found in reference file, continuing...',
          {
            timestamp: true,
          }
        );
      }
    },
  };
}

export async function electronNxViteConfig() {
  return await electron({
    main: {
      entry: resolve(projectRoot, 'src/main/main.ts'),
      onstart: () => {
        const mainPath = resolve(
          workspaceRoot,
          'dist/apps/frontend-electron/main.js'
        );
        logger.info('🚀 Starting Electron with main path: ' + mainPath, {
          timestamp: true,
        });
        startup(
          [
            /**
             * port to debug the main process
             */
            '--inspect=5858',
            /**
             * port to debug the renderer process
             */
            '--remote-debugging-port=4975',
            /**
             * additional flags
             */
            '--enable-logging',
            '--log-level=0',
            mainPath,
          ],
          {
            cwd: workspaceRoot,
            env: {
              ...process.env,
              ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
              NODE_ENV: 'development',
            },
          }
        );
      },
      vite: {
        logLevel: 'info',
        build: {
          commonjsOptions: {
            ignoreDynamicRequires: true,
          },
          outDir: resolve(workspaceRoot, 'dist/apps/frontend-electron'),
          sourcemap: true,
          minify: false,
          rollupOptions: {
            external: dependencies,
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
            },
          },
        },
        plugins: [
          cleanDist(),
          copyNative({
            pathReference: resolve(
              projectRoot,
              'src/main/native/reference.json'
            ),
          }),
        ],
      },
    },
    preload: {
      input: resolve(projectRoot, 'src/preload/preload.ts'),
      vite: withDebug({
        logLevel: 'info',
        build: {

          outDir: resolve(workspaceRoot, 'dist/apps/frontend-electron'),
          sourcemap: 'inline',
          rollupOptions: {
            external: dependencies,
            output: {
              entryFileNames: '[name].js',
              chunkFileNames: '[name].js',
            },
          },
        },
        plugins: [],
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async configureServer(server: any) {
      try {
        await waitOn({
          resources: [`${url}`],
          timeout,
          log: false,
          validateStatus: (status) => status === 200,
        });
        logger.info(
          `🚀 Frontend application ${url} is available. Preparing electron to host Target Project.`
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        logger.error(`Error: unable to perform operation:`, err.message);
        process.exit(1);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      server.middlewares.use((req: any, res: any, next: any) => {
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
        if (index !== -1) {
          (config.plugins as Plugin[]).splice(index, 1);
        }
        rmSync(debugFile);
      },
    });
  }

  return config;
}

export default electronNxViteConfig;
