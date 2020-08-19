/// <reference types="webpack-dev-server" />
import { Configuration } from 'webpack';
export interface MainWebpackConfigOptions {
    cwd: string;
    babelLoaderOptions: object;
    tsconfig: string;
}
export default function ({ cwd, babelLoaderOptions, tsconfig }: MainWebpackConfigOptions): Configuration;
