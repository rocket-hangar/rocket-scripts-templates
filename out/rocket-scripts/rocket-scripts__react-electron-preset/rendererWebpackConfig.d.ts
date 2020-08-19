/// <reference types="webpack-dev-server" />
import { WebpackConfigOptions } from '@rocket-scripts/react-preset/webpackConfig';
import { Configuration } from 'webpack';
export interface RendererWebpackConfigOptions extends WebpackConfigOptions {
}
export default function ({ cwd, babelLoaderOptions, chunkPath, publicPath, tsconfig, extractCss, }: RendererWebpackConfigOptions): Configuration;
