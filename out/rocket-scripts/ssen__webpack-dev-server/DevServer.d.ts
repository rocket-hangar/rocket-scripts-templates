import { Compiler, Configuration as WebpackConfiguration } from 'webpack';
import WebpackDevServer, { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import { DevServerStatus, WebpackStats } from './types';
export interface DevServerParams {
    port: number;
    hostname: string;
    webpackConfig: WebpackConfiguration;
    devServerConfig: WebpackDevServerConfiguration;
}
export declare class DevServer {
    readonly compiler: Compiler;
    readonly devServer: WebpackDevServer;
    readonly url: string;
    private readonly statusSubject;
    private readonly webpackStatsSubject;
    private readonly startResolvers;
    private readonly closeResolvers;
    constructor({ port, hostname, webpackConfig, devServerConfig }: DevServerParams);
    status: () => import("rxjs").Observable<DevServerStatus>;
    webpackStats: () => import("rxjs").Observable<WebpackStats>;
    waitUntilStart: () => Promise<void>;
    private onStart;
    close: () => void;
    waitUntilClose: () => Promise<void>;
    private onClose;
}
