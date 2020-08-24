import { start } from '@rocket-scripts/web';
import { Divider } from '@ssen/dev-server-components';
import chokidar from 'chokidar';
import { format } from 'date-fns';
import { FSWatcher } from 'fs';
import fs from 'fs-extra';
import { Text, useInput } from 'ink';
import path from 'path';
import puppeteer, { Browser } from 'puppeteer';
import React, { useCallback, useEffect, useState } from 'react';

const profileStore: string = path.join(process.cwd(), 'profiles');

function ProfileRepeater({
  browser,
  pageUrl,
  shortcuts,
}: {
  browser: Browser;
  pageUrl: string;
  shortcuts: {
    record: string;
    clean: string;
  };
}) {
  const [profiles, setProfiles] = useState<string[]>([]);

  const run = useCallback(async () => {
    const page = await browser.newPage();

    const profile: string = path.join(
      profileStore,
      `animate-${format(new Date(), 'yyyy-MM-dd-hhmmss')}.json`,
    );

    await page.tracing.start({
      path: profile,
      screenshots: true,
      // @see ~/tracing.categories.json
      // const cdp: CDPSession = await page._client;
      // const categories = await cdp.send('Tracing.getCategories');
      categories: [
        'devtools.timeline',
        'disabled-by-default-devtools.timeline',
        'disabled-by-default-devtools.timeline.frame',
        'disabled-by-default-devtools.timeline.stack',
        'disabled-by-default-v8.cpu_profiler',
        'disabled-by-default-v8.cpu_profiler.hires',
        'memory',
      ],
    });

    await page.goto(pageUrl);

    await page.waitFor(4000);

    await page.tracing.stop();

    await page.close();
  }, [browser, pageUrl]);

  useEffect(() => {
    function update() {
      setProfiles(fs.readdirSync(profileStore).filter((file) => /^animate-/.test(file)));
    }

    const watcher: FSWatcher = chokidar
      .watch([`${profileStore}/*.json`])
      .on('add', update)
      .on('unlink', update);

    return () => {
      watcher.close();
    };
  }, []);

  useInput((input) => {
    switch (input) {
      case shortcuts.record:
        run();
        break;
      case shortcuts.clean:
        for (const file of fs.readdirSync(profileStore)) {
          if (/[0-9]{4}-[0-9]{2}-[0-9]{2}-[0-9]{6}\.json$/.test(file)) {
            fs.removeSync(path.join(profileStore, file));
          }
        }
        break;
    }
  });

  return (
    <>
      <Divider bold>
        {`Profiles (${shortcuts.record}) Create a new profile (${shortcuts.clean}) Clean temp profiles`}
      </Divider>
      {profiles.map((file) => (
        <Text key={file}>{file}</Text>
      ))}
    </>
  );
}

(async () => {
  const remoteDebuggingPort: number = +(process.env.INSPECT_CHROME ?? 9222);
  const webPort: number = +(process.env.DEV_SERVER_PORT ?? 9633);

  await fs.mkdirp(profileStore);

  const browser = await puppeteer.launch({
    userDataDir: process.env.CHROMIUM_USER_DATA_DEBUG,
    headless: false,
    args: ['--start-fullscreen', `--remote-debugging-port=${remoteDebuggingPort}`],
    devtools: true,
  });

  await start({
    app: 'app',
    port: webPort,
    children: (
      <ProfileRepeater
        browser={browser}
        pageUrl={`http://localhost:${webPort}`}
        shortcuts={{ record: 'x', clean: 'c' }}
      />
    ),
  });
})();
