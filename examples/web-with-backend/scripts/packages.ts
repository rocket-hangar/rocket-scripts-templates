import { PackageConfig } from 'rocket-punch';

export const entry: Record<string, string | PackageConfig> = {
  '@myorg/*': {
    version: '0.1.0',
    module: 'commonjs',
    
    // set your private registry
    access: 'private',
    registry: 'https://npm.pkg.github.com',
  },
};