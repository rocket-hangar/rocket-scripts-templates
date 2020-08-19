"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackServer = void 0;
const rxjs_1 = require("rxjs");
const webpack_1 = __importDefault(require("webpack"));
const types_1 = require("./types");
class WebpackServer {
    constructor({ mainWebpackConfig, rendererWebpackConfig, mainWebpackWatchOptions, rendererWebpackWatchOptions, }) {
        this.startResolvers = new Set();
        this.closeResolvers = new Set();
        this.status = () => this.statusSubject.asObservable();
        this.mainWebpackStats = () => this.mainWebpackStatusSubject.asObservable();
        this.rendererWebpackStats = () => this.rendererWebpackStatusSubject.asObservable();
        this.waitUntilStart = () => new Promise((resolve) => {
            if (this.statusSubject.getValue() >= types_1.WebpackServerStatus.STARTED) {
                resolve();
            }
            else {
                this.startResolvers.add(resolve);
            }
        });
        this.onStart = () => {
            for (const resolve of this.startResolvers) {
                resolve();
            }
            this.startResolvers.clear();
            this.statusSubject.next(types_1.WebpackServerStatus.STARTED);
        };
        this.close = () => {
            if (this.statusSubject.getValue() !== types_1.WebpackServerStatus.STARTED) {
                return;
            }
            this.statusSubject.next(types_1.WebpackServerStatus.CLOSING);
            let mainClosed = false;
            let rendererClosed = false;
            this.mainWatching.close(() => {
                mainClosed = true;
                if (mainClosed && rendererClosed) {
                    this.onClose();
                }
            });
            this.rendererWatching.close(() => {
                rendererClosed = true;
                if (mainClosed && rendererClosed) {
                    this.onClose();
                }
            });
        };
        this.waitUntilClose = () => new Promise((resolve) => {
            if (this.statusSubject.isStopped || this.statusSubject.getValue() >= types_1.WebpackServerStatus.CLOSED) {
                resolve();
            }
            else {
                this.closeResolvers.add(resolve);
            }
        });
        this.onClose = () => {
            for (const resolve of this.closeResolvers) {
                resolve();
            }
            this.closeResolvers.clear();
            this.mainWebpackStatusSubject.unsubscribe();
            this.rendererWebpackStatusSubject.unsubscribe();
            this.statusSubject.next(types_1.WebpackServerStatus.CLOSED);
            this.statusSubject.unsubscribe();
        };
        this.mainCompiler = webpack_1.default(mainWebpackConfig);
        this.rendererCompiler = webpack_1.default(rendererWebpackConfig);
        this.statusSubject = new rxjs_1.BehaviorSubject(types_1.WebpackServerStatus.STARTING);
        this.mainWebpackStatusSubject = new rxjs_1.BehaviorSubject({ status: 'waiting' });
        this.mainCompiler.hooks.invalid.tap('invalid', () => {
            this.mainWebpackStatusSubject.next({
                status: 'invalid',
            });
        });
        this.mainWatching = this.mainCompiler.watch(mainWebpackWatchOptions, (error, statsData) => {
            if (error) {
                throw error;
            }
            else {
                console.log(statsData.toString({
                    colors: false,
                }));
                this.mainWebpackStatusSubject.next({
                    status: 'done',
                    statsData,
                });
            }
        });
        this.rendererWebpackStatusSubject = new rxjs_1.BehaviorSubject({ status: 'waiting' });
        this.rendererCompiler.hooks.invalid.tap('invalid', () => {
            this.rendererWebpackStatusSubject.next({
                status: 'invalid',
            });
        });
        this.rendererWatching = this.rendererCompiler.watch(rendererWebpackWatchOptions, (error, statsData) => {
            if (error) {
                throw error;
            }
            else {
                console.log(statsData.toString({
                    colors: false,
                }));
                this.rendererWebpackStatusSubject.next({
                    status: 'done',
                    statsData,
                });
            }
        });
        const startSubscription = rxjs_1.combineLatest([
            this.mainWebpackStatusSubject,
            this.rendererWebpackStatusSubject,
        ]).subscribe(([main, renderer]) => {
            if (main.status !== 'waiting' && renderer.status !== 'waiting') {
                startSubscription.unsubscribe();
                this.onStart();
            }
        });
    }
}
exports.WebpackServer = WebpackServer;
//# sourceMappingURL=WebpackServer.js.map