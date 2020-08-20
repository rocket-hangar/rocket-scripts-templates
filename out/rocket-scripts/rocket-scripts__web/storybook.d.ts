import { Configuration } from 'webpack';
export interface WebpackFinalParams {
    cwd?: string;
}
export declare const webpackFinal: ({ cwd }: WebpackFinalParams) => (config: Configuration) => Promise<Configuration>;
