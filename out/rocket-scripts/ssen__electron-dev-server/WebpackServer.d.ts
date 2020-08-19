/// <reference types="webpack-dev-server" />
import { Compiler, Configuration as WebpackConfiguration } from 'webpack';
import { WebpackServerStatus, WebpackStats } from './types';
export interface WebpackServerParams {
    mainWebpackConfig: WebpackConfiguration;
    mainWebpackWatchOptions: Compiler.WatchOptions;
    rendererWebpackConfig: WebpackConfiguration;
    rendererWebpackWatchOptions: Compiler.WatchOptions;
}
export declare class WebpackServer {
    readonly mainCompiler: Compiler;
    readonly rendererCompiler: Compiler;
    private mainWatching;
    private rendererWatching;
    private readonly statusSubject;
    private readonly mainWebpackStatusSubject;
    private readonly rendererWebpackStatusSubject;
    private readonly startResolvers;
    private readonly closeResolvers;
    constructor({ mainWebpackConfig, rendererWebpackConfig, mainWebpackWatchOptions, rendererWebpackWatchOptions, }: WebpackServerParams);
    status: () => import("rxjs").Observable<WebpackServerStatus>;
    mainWebpackStats: () => import("rxjs").Observable<WebpackStats>;
    rendererWebpackStats: () => import("rxjs").Observable<WebpackStats>;
    waitUntilStart: () => Promise<void>;
    private onStart;
    close: () => void;
    waitUntilClose: () => Promise<void>;
    private onClose;
}
