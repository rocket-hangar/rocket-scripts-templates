import * as Sentry from '@sentry/electron/dist/renderer';
import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('Sentry', Sentry);

contextBridge.exposeInMainWorld('hello', {
  world: () => {
    return 'Hello World!';
  },
});
