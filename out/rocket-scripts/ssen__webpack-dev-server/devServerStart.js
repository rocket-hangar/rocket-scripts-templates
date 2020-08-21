"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServerStart = void 0;
const patch_console_1 = require("@ssen/patch-console");
const fs_extra_1 = __importDefault(require("fs-extra"));
const ink_1 = require("ink");
const path_1 = __importDefault(require("path"));
const react_1 = __importDefault(require("react"));
const rxjs_1 = require("rxjs");
const tmp_1 = __importDefault(require("tmp"));
const webpack_merge_1 = require("webpack-merge");
const DevServer_1 = require("./DevServer");
const DevServerUI_1 = require("./DevServerUI");
const patchProxyLogger_1 = require("./utils/patchProxyLogger");
async function devServerStart({ stdout = process.stdout, stdin = process.stdin, header, cwd = process.cwd(), logfile = tmp_1.default.fileSync({ mode: 0o644, postfix: '.log' }).name, port, hostname, webpackConfig, devServerConfig, restartAlarm, children, }) {
    console.clear();
    if (!fs_extra_1.default.existsSync(path_1.default.dirname(logfile))) {
        fs_extra_1.default.mkdirpSync(path_1.default.dirname(logfile));
    }
    const stream = fs_extra_1.default.createWriteStream(logfile);
    const restoreConsole = patch_console_1.patchConsole({ stdout: stream, stderr: stream, colorMode: false });
    let proxy = undefined;
    let proxySubject = undefined;
    if (devServerConfig.proxy) {
        proxySubject = new rxjs_1.BehaviorSubject([]);
        proxy = patchProxyLogger_1.patchProxyLogger({ proxyConfig: devServerConfig.proxy, subject: proxySubject });
    }
    const server = new DevServer_1.DevServer({
        port,
        hostname,
        webpackConfig: webpack_merge_1.merge(webpackConfig, {
        // TODO
        }),
        devServerConfig: {
            ...devServerConfig,
            // TODO
            proxy,
        },
    });
    const { unmount } = ink_1.render(react_1.default.createElement(DevServerUI_1.DevServerUI, { header: header, devServer: server, cwd: cwd, proxyMessage: proxySubject, logfile: logfile, restartAlarm: restartAlarm, children: children }), {
        stdout,
        stdin,
        patchConsole: false,
    });
    await server.waitUntilStart();
    return async () => {
        server.close();
        await server.waitUntilClose();
        unmount();
        if (proxySubject)
            proxySubject.unsubscribe();
        restoreConsole();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };
}
exports.devServerStart = devServerStart;
//# sourceMappingURL=devServerStart.js.map