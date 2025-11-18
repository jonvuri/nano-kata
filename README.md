# nano-kata

simple, focused tracking of kata cycles

## seveloping

install dependencies with `pnpm install` or `yarn`, then start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

by default, `npm run build` will generate a Node app that you can run with `npm start`. to use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## this project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
