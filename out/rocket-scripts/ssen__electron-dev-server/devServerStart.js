"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devServerStart = void 0;
const electron_switches_1 = require("@ssen/electron-switches");
const mirror_files_1 = require("@ssen/mirror-files");
const patch_console_1 = require("@ssen/patch-console");
const tmp_directory_1 = require("@ssen/tmp-directory");
const fs_extra_1 = __importDefault(require("fs-extra"));
const ink_1 = require("ink");
const path_1 = __importDefault(require("path"));
const react_1 = __importDefault(require("react"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tmp_1 = __importDefault(require("tmp"));
const webpack_merge_1 = require("webpack-merge");
const DevServerUI_1 = require("./DevServerUI");
const ElectronServer_1 = require("./ElectronServer");
const WebpackServer_1 = require("./WebpackServer");
async function devServerStart({ mainWebpackConfig, rendererWebpackConfig, staticFileDirectories, stdout = process.stdout, stdin = process.stdin, header, cwd = process.cwd(), outDir, logfile = tmp_1.default.fileSync({ mode: 0o644, postfix: '.log' }).name, electronSwitches = {}, restartAlarm, }) {
    console.clear();
    const stream = fs_extra_1.default.createWriteStream(logfile);
    const restoreConsole = patch_console_1.patchConsole({ stdout: stream, stderr: stream, colorMode: false });
    if (!outDir) {
        outDir = await tmp_directory_1.createTmpDirectory();
    }
    await fs_extra_1.default.mkdirp(outDir);
    const outNodeModules = path_1.default.join(outDir, 'node_modules');
    if (fs_extra_1.default.existsSync(outNodeModules))
        fs_extra_1.default.unlinkSync(outNodeModules);
    await fs_extra_1.default.symlink(path_1.default.join(cwd, 'node_modules'), outNodeModules);
    const syncStaticFiles = Array.isArray(staticFileDirectories) && staticFileDirectories.length > 0
        ? mirror_files_1.mirrorFiles({
            filesDirsOrGlobs: staticFileDirectories,
            outDir,
        })
        : undefined;
    const syncStaticFilesCaster = syncStaticFiles === null || syncStaticFiles === void 0 ? void 0 : syncStaticFiles.pipe(operators_1.multicast(() => new rxjs_1.Subject()));
    const syncStaticFilesSubscription = syncStaticFilesCaster === null || syncStaticFilesCaster === void 0 ? void 0 : syncStaticFilesCaster.connect();
    const webpackServer = new WebpackServer_1.WebpackServer({
        mainWebpackConfig: webpack_merge_1.merge(mainWebpackConfig, {
            // TODO
            output: {
                path: outDir,
            },
        }),
        rendererWebpackConfig: webpack_merge_1.merge(rendererWebpackConfig, {
            // TODO
            output: {
                path: outDir,
            },
        }),
        mainWebpackWatchOptions: {},
        rendererWebpackWatchOptions: {},
    });
    await webpackServer.waitUntilStart();
    const electronServer = new ElectronServer_1.ElectronServer({
        argv: electron_switches_1.toElectronArgv(electronSwitches),
        dir: outDir,
        main: path_1.default.join(outDir, 'main.js'),
    });
    const { unmount } = ink_1.render(react_1.default.createElement(DevServerUI_1.DevServerUI, { header: header, webpackServer: webpackServer, electronServer: electronServer, cwd: cwd, logfile: logfile, syncStaticFiles: syncStaticFilesCaster, restartAlarm: restartAlarm }), {
        stdout,
        stdin,
        patchConsole: false,
    });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return async () => {
        electronServer.close();
        webpackServer.close();
        await webpackServer.waitUntilClose();
        unmount();
        syncStaticFilesSubscription === null || syncStaticFilesSubscription === void 0 ? void 0 : syncStaticFilesSubscription.unsubscribe();
        restoreConsole();
        await new Promise((resolve) => setTimeout(resolve, 1000));
    };
}
exports.devServerStart = devServerStart;
//# sourceMappingURL=devServerStart.js.map