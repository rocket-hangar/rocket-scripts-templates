import { serverStart } from '@myorg/api-server';
import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';

(async () => {
  // you can debug server process with 9688
  // @see scripts of package.json `"start": "node --inspect-brk=9688..."`
  // you can debug web process with 9222
  const remoteDebuggingPort: number = 9222;
  const serverPort: number = 9455;
  
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
  
  await page.waitForFunction(`document.querySelector('#app h1').innerHTML === 'Hello World!'`, {
    timeout: 1000 * 60,
    polling: 1000 * 3,
  });
})();
