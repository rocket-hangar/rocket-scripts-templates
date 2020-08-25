# Electron development template

## Use this template

```sh
# create a workspace directory
npx generate-github-directory https://github.com/rocket-hangar/workspace-template my-project
cd my-project

# create an app
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/electron my-app

# add "my-app" to workspaces of package.json

# install
yarn

# directory
cd my-app
cp .envrc.template .envrc
direnv allow .

# start
yarn run start
```

## Without yarn workspaces

```sh
# create an app
npx generate-github-directory https://github.com/rocket-hangar/rocket-scripts-templates/tree/master/templates/electron my-app

cd my-app
cp .envrc.template .envrc
direnv allow .

# install
npm install # or yarn

# start
npm run start # or yarn run start
```

## Scripts

- `yarn run start` start development (see `scripts/start.ts`)
- `yarn run build` build production to `out/app` (see `scripts/build.ts`)
- `yarn run pack` create executable from `out/app` to `apps/app` (see `scripts/pack.ts`)
- `yarn run storybook:start` start storybook
- `yarn run storybook:build` build storybook to `out/storybook`
- `yarn run test` jest test
- `yarn run coverage` jest test to create coverage report

## Directories

- `scripts/` development scripts
- `public/` static files (the files in this directory are apply on the webroot. e.g. `public/favicon.ico` to be `http://localhost/favicon.ico`)
- `src/` source files
    - `src/app` app root (this directory name `app` can look at in the `scripts/start.ts`)
    - `src/app/main.ts` electron main process
    - `src/app/preload.ts` electron preload process
    - `src/app/renderer.tsx` electron renderer process
    - `src/app/index.html` html template
