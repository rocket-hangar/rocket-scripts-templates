# Electron development template

## Use this template

```sh
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/electron project-directory
cd project-directory
git init
yarn # or npm install
yarn start # or npm start
```

## Scripts

- `yarn run start` start development (see `scripts/start.ts`)
- `yarn run build` build production to `out/app` (see `scripts/build.ts`)
- `yarn run storybook:start` start storybook
- `yarn run storybook:build` build storybook to `out/storybook`
- `yarn run test` jest test
- `yarn run coverage` jest test to create coverage report
- `yarn run format` format source codes by prettier
- `yarn run lint` lint source codes by eslint

## Directories

- `scripts/` development scripts
- `public/` static files (the files in this directory are apply on the webroot. e.g. `public/favicon.ico` to be `http://localhost/favicon.ico`)
- `src/` source files
    - `src/app` app root (this directory name `app` can look at in the `scripts/start.ts`)
    - `src/app/main.ts` electron main process
    - `src/app/preload.ts` electron preload process
    - `src/app/renderer.tsx` electron renderer process
    - `src/app/index.html` html template