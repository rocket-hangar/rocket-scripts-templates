# Express.js Server + Web development Snippet

## Strategy

- `yarn run start` (see `scripts/start.ts`)
    - start back-end server
    - start front-end dev server
    - start puppeteer
- `yarn run build` (see `scripts/build.ts`)
    - build back-end server to packages (and publish to registry)
    - build front-end static files

## Updates from web template

- `yarn run start` script is using `node -r ts-node/register` instead of `ts-node`.   
  it make available to use `--inspect-brk` to debug server process.
- `yarn run build` script is using `rocket-punch` for make server to packages.
- all scripts are using `-r tsconfig-paths/register`.
  it make avaliable to use `import '@myorg/*'` on `scripts/*`
- `baseUrl` and `include` properties of `tsconfig.*.json` files are a bit changed.