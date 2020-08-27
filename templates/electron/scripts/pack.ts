import { rimraf } from '@ssen/promised';
import { build, Configuration, Platform } from 'electron-builder';
import fs from 'fs-extra';
import path from 'path';

const appId: string = 'myorg.appid';

(async () => {
  await rimraf(path.join(process.cwd(), 'apps'));

  await fs.copy(
    path.join(process.cwd(), 'src/app/package.json'),
    path.join(process.cwd(), 'out/app/package.json'),
  );

  const config: Configuration = {
    electronVersion: require('electron/package.json').version,
    appId,
    productName: 'MyApp',
    directories: {
      buildResources: path.join(process.cwd(), 'buildResources'),
      output: path.join(process.cwd(), 'apps/app'),
    },
  };

  const mac = build({
    targets: Platform.MAC.createTarget(),
    projectDir: path.join(process.cwd(), 'out/app'),
    config: {
      ...config,
      mac: {
        // @see https://developer.apple.com/documentation/bundleresources/information_property_list/lsapplicationcategorytype
        category: 'public.app-category.utilities',
      },
      // Enable when you ready to Apple Notarization
      //afterSign: async ({ appOutDir, packager }) => {
      //  if (!process.env.APPLE_DEVELOPER_ID || !process.env.APPLE_DEVELOPER_PASSWORD) {
      //    throw new Error(`Undefiend $APPLE_DEVELOPER_ID and $APPLE_DEVELOPER_PASSWORD`);
      //  }
      //
      //  console.log(`🚀 Start Apple Notarize...`);
      //
      //  // import { notarize } from 'electron-notarize'
      //  return await notarize({
      //    appBundleId: appId,
      //    appPath: `${appOutDir}/${packager.appInfo.productFilename}.app`,
      //    appleId: process.env.APPLE_DEVELOPER_ID,
      //    appleIdPassword: process.env.APPLE_DEVELOPER_PASSWORD,
      //  });
      //},
    },
  });

  const win = build({
    targets: Platform.WINDOWS.createTarget(),
    projectDir: path.join(process.cwd(), 'out/app'),
    config: {
      ...config,
      win: {
        target: {
          target: 'nsis',
          arch: ['x64', 'ia32'],
        },
      },
      nsis: {
        perMachine: true,
      },
    },
  });

  const linux = build({
    targets: Platform.LINUX.createTarget(),
    projectDir: path.join(process.cwd(), 'out/app'),
    config: {
      ...config,
      linux: {
        target: ['deb'],
      },
    },
  });

  const appPaths = await Promise.all([mac, win, linux]).then(([mac, win, linux]) => ({ mac, win, linux }));

  console.log('👍 Build successfully!', appPaths);
})();
