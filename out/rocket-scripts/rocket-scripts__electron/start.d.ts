import { DevServerStartParams } from '@ssen/electron-dev-server';
import { StartParams } from './params';
export interface Start extends DevServerStartParams {
    close: () => Promise<void>;
}
export declare function start({ cwd, app, staticFileDirectories: _staticFileDirectories, outDir: _outDir, electronSwitches, env, tsconfig: _tsconfig, mainWebpackConfig: _mainWebpackConfig, rendererWebpackConfig: _rendererWebpackConfig, babelLoaderOptions: _babelLoaderOptions, logfile: _logfile, stdout, stdin, }: StartParams): Promise<Start>;
