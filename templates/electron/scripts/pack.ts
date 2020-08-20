import { rimraf } from '@ssen/promised';
import packager from 'electron-packager';
import path from 'path';

(async () => {
  await rimraf(path.join(process.cwd(), 'apps'));
  
  const appPaths = await packager({
    dir: path.join(process.cwd(), 'out/app'),
    out: path.join(process.cwd(), 'apps/app'),
    // if you are on macos
    //    you have to install wine to build win32
    //    brew cask install xquartz wine-stable
    // @see https://electron.github.io/electron-packager/master/#related
    platform: ['darwin', 'linux', 'win32'],
  });
  
  console.log('👍 Build successfully!', appPaths);
})();