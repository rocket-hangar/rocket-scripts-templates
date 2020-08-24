import { start } from '@rocket-scripts/electron';
import puppeteer, { Browser } from 'puppeteer-core';

(async () => {
  // main process debugging port
  // @see https://www.jetbrains.com/help/webstorm/run-debug-configuration-node-js-remote-debug.html
  // @see https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_setting-up-an-attach-configuration
  const inspectPort: number = +(process.env.INSPECT_MAIN ?? 9365);

  // renderer process debugging port
  // @see https://www.jetbrains.com/help/webstorm/run-debug-configuration-node-js-remote-debug.html
  // @see https://github.com/microsoft/vscode-chrome-debug#attach
  const remoteDebuggingPort: number = +(process.env.INSPECT_RENDERER ?? 9366);

  await start({
    app: 'app',
    electronSwitches: {
      'inspect-brk': `${inspectPort}`,
      'remote-debugging-port': remoteDebuggingPort,
    },
    // type ctrl + space (your code completion shortcut on your IDE)
    // you can look at more configuration options
  });

  const browser: Browser = await puppeteer.connect({
    browserURL: `http://localhost:${remoteDebuggingPort}`,
  });

  const page = await browser.pages().then((pages) => pages.find((page) => /index\.html$/.test(page.url())));

  if (!page) {
    throw new Error(`Can't connect the page`);
  }

  await page.waitForFunction(`document.querySelector('#app h1').innerHTML === 'Hello World!'`, {
    timeout: 1000 * 60,
    polling: 1000 * 3,
  });

  // if you want to start with another situation
  // you can make another script file like this script file
  // and, add the made script to the scripts section of package.json
})();
