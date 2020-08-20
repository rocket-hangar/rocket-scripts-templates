import { build } from '@rocket-scripts/electron';

(async () => {
  await build({
    app: 'app',
    // type ctrl + space (your code completion shortcut on your IDE)
    // you can look at more configuration options
  });
})();
