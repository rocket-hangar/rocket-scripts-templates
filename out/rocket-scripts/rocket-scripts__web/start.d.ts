import { DevServerStartParams } from '@ssen/webpack-dev-server';
import { StartParams } from './params';
export interface Start extends DevServerStartParams {
    close: () => Promise<void>;
}
export declare function start({ cwd, app, staticFileDirectories: _staticFileDirectories, env, tsconfig: _tsconfig, port: _port, hostname, webpackConfig: _webpackConfig, webpackDevServerConfig: _webpackDevServerConfig, babelLoaderOptions: _babelLoaderOptions, logfile: _logfile, stdout, stdin, }: StartParams): Promise<Start>;
