import { start } from '@rocket-scripts/web';
import puppeteer from 'puppeteer';

(async () => {
  const { port } = await start({
    app: 'app',
    // type ctrl + space (your code completion shortcut on your IDE)
    // you can look at more configuration options
  });
  
  const browser = await puppeteer.launch({
    //userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: ['--start-fullscreen'],
    devtools: true,
  });
  
  const [page] = await browser.pages();
  await page.goto(`http://localhost:${port}`);
  
  // if you want to start with another situation
  // you can make another script file like this script file
  // and, add the made script to the scripts section of package.json
})();
