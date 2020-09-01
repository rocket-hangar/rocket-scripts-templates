import { serverStart } from '@myorg/api-server';
import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);
  const serverPort: number = +(process.env.API_SERVER_PORT ?? 9455);

  // start back-end server
  await serverStart({ port: serverPort });

  // start front-end dev server
  const { port } = await start({
    app: 'client',
    webpackDevServerConfig: {
      // bind proxy `<back-end>/*` -> `<front-end>/api/*`
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
          logLevel: 'debug',
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    },
  });

  // start puppeteer
  const browser = await puppeteer.launch({
    //userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: [
      '--start-fullscreen',
      `--remote-debugging-port=${remoteDebuggingPort}`,
    ],
    devtools: true,
  });

  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);

  await page.waitForFunction(
    `document.querySelector('#app h1')?.innerHTML === 'Hello World!'`,
    {
      timeout: 1000 * 60,
      polling: 1000 * 3,
    },
  );
})();
