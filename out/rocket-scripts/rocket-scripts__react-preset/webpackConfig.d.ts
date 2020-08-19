/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export interface WebpackConfigOptions {
    cwd: string;
    chunkPath: string;
    publicPath: string;
    babelLoaderOptions: object;
    tsconfig: string;
    extractCss: boolean;
}
export default function ({ cwd, chunkPath, publicPath, babelLoaderOptions, tsconfig, extractCss, }: WebpackConfigOptions): Configuration;
