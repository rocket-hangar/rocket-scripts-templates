import { build as webBuild } from '@rocket-scripts/web';
import { publish as packagesPublish } from 'rocket-punch';
import { build as packagesBuild } from 'rocket-punch/build';
import { entry } from './packages';

(async () => {
  // it will create the web static files in `out/client`
  // upload it to your static file hosting
  await webBuild({
    app: 'client',
  });
  
  // it will create the package files in `out/packages`
  await packagesBuild({
    entry,
  });
  
  // and, it will pulbish the built package files `out/packages` to registry
  await packagesPublish({
    entry,
    // skipSelection: true,
  });
  
  // you can install the server package with `npm install @myorg/api-server`
  // and, you can run the server with `import { serverStart } from '@myorg/api-server'`
  // also, it means that your server package is versioned by semver.
  // you can always rollback the server version with like `npm install @myorg/api-server@1.4.6`
})();
