"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElectronServer = void 0;
const child_process_1 = require("child_process");
const chokidar_1 = require("chokidar");
const electron_1 = __importDefault(require("electron"));
class ElectronServer {
    constructor(params) {
        this.params = params;
        this.proc = null;
        this.watcher = null;
        this.restart = () => {
            var _a;
            (_a = this.proc) === null || _a === void 0 ? void 0 : _a.kill();
            this.startProc();
        };
        this.close = () => {
            var _a, _b;
            (_a = this.proc) === null || _a === void 0 ? void 0 : _a.kill();
            this.proc = null;
            (_b = this.watcher) === null || _b === void 0 ? void 0 : _b.close();
            this.watcher = null;
        };
        this.startProc = () => {
            const { main, dir, argv } = this.params;
            //@ts-ignore
            this.proc = child_process_1.spawn(electron_1.default, [...argv, main], { cwd: dir, shell: true });
        };
        this.startProc();
        this.watcher = chokidar_1.watch(params.main).on('change', this.restart);
        process.on('exit', this.close);
        process.on('SIGINT', this.close);
        process.on('SIGTERM', this.close);
    }
}
exports.ElectronServer = ElectronServer;
//# sourceMappingURL=ElectronServer.js.map