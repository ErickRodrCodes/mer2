# How to debug this electron application?

When you create an electron app with @erickrodrcodes/nx-electron, it offers by default main process and renderer debbuging.

## Setting up your debugger

First, check the `.env` file provided in this application. in that you will observe some default settings:

- For Main process, the port used by your default configuration is 5858
- For Renderer process, the port used by your default configuration is 4975

If you do not preffer its usage, the values are hardcoded on the `electron-nx-vite.config.ts` of this project.

That said, a `launch.json` from VSCode would look like this:

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Electron Main - <$= nameProject ",
      "type": "node",
      "request": "attach",
      "port": 5858,
      "restart": true,
      "skipFiles": ["<node_internals>/**"],
      "presentation": {
        "hidden": true,
        "group": "",
        "order": 1
      }
    },
    {
      "name": "Attach to Electron Renderer - <$= nameProject ",
      "type": "pwa-chrome",
      "request": "attach",
      "port": 4975,
      "webRoot": "${workspaceFolder}",
      "presentation": {
        "hidden": true,
        "group": "",
        "order": 1
      }
    }
  ],
  "compounds": [
    {
      "name": "Debug <$= nameProject ",
      "configurations": ["Attach to Electron Main - <$= nameProject ", "Attach to Electron Renderer - <$= nameProject "],
      "preLaunchTask": "pnpm: serve-<$= nameProject " // optional if you are using a task with such execution
    }
  ]
}
```

With this in mind, it is possible to run multiple electron applications in a large codebase each one handling its own configuration. Just setup the needed compounds for separate electron applications pointing to different configurations, and keep different ports for each app.

### If you're using a `tasks.json`

If you want to use `configurations.compounds[].preLaunchTask`, the execution should look like this in `tasks.json` (if you are using `npx`, just replace `pnpm exec` with `npx`, and `pnpm:` with `npm:`)

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "type": "shell",
      "label": "pnpm: serve-<$= nameProject ",
      "command": "pnpm exec nx run <$= nameProject :electron:serve",
      "isBackground": true,
      "problemMatcher": {
        "owner": "custom",
        "pattern": [
          {
            "regexp": ".",
            "file": 1,
            "location": 2,
            "message": 0
          }
        ],
        "background": {
          "activeOnStart": true,
          "beginsPattern": "🚀 Starting Electron with main path:",
          /**
           * change the string on endsPattern when your renderer is ready based on the terminal output.
           * In this case, debugging for renderer will start when the terminal outputs an
           * an Angular frontend application.
           */
          "endsPattern": "Angular is running in development mode"
        }
      },
      "detail": "pnpm exec nx run <$= nameProject :electron:serve"
    }
  ]
}
```
