"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServer = void 0;
const rxjs_1 = require("rxjs");
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const types_1 = require("./types");
class DevServer {
    constructor({ port, hostname, webpackConfig, devServerConfig }) {
        this.startResolvers = new Set();
        this.closeResolvers = new Set();
        this.status = () => this.statusSubject.asObservable();
        this.webpackStats = () => this.webpackStatsSubject.asObservable();
        this.waitUntilStart = () => new Promise((resolve) => {
            if (this.statusSubject.getValue() >= types_1.DevServerStatus.STARTED) {
                resolve();
            }
            else {
                this.startResolvers.add(resolve);
            }
        });
        this.onStart = (error) => {
            if (error) {
                throw error;
            }
            for (const resolve of this.startResolvers) {
                resolve();
            }
            this.startResolvers.clear();
            this.statusSubject.next(types_1.DevServerStatus.STARTED);
        };
        this.close = () => {
            if (this.statusSubject.getValue() !== types_1.DevServerStatus.STARTED) {
                return;
            }
            this.statusSubject.next(types_1.DevServerStatus.CLOSING);
            this.devServer.close(this.onClose);
        };
        this.waitUntilClose = () => new Promise((resolve) => {
            if (this.statusSubject.isStopped || this.statusSubject.getValue() >= types_1.DevServerStatus.CLOSED) {
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
            this.webpackStatsSubject.unsubscribe();
            this.statusSubject.next(types_1.DevServerStatus.CLOSED);
            this.statusSubject.unsubscribe();
        };
        this.url = (devServerConfig.https ? 'https://' : 'http://') + hostname + ':' + port;
        this.compiler = webpack_1.default(webpackConfig);
        this.statusSubject = new rxjs_1.BehaviorSubject(types_1.DevServerStatus.STARTING);
        this.webpackStatsSubject = new rxjs_1.BehaviorSubject({ status: 'waiting' });
        this.devServer = new webpack_dev_server_1.default(this.compiler, devServerConfig);
        this.devServer.listen(port, hostname, this.onStart);
        this.compiler.hooks.invalid.tap('invalid', () => {
            this.webpackStatsSubject.next({
                status: 'invalid',
            });
        });
        this.compiler.hooks.done.tap('done', (statsData) => {
            this.webpackStatsSubject.next({
                status: 'done',
                statsData,
            });
        });
    }
}
exports.DevServer = DevServer;
//# sourceMappingURL=DevServer.js.map