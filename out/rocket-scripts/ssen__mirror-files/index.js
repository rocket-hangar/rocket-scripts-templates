"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mirrorFiles = void 0;
const chokidar_1 = require("chokidar");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const rxjs_1 = require("rxjs");
function mirrorFiles({ filesDirsOrGlobs, outDir, ignored }) {
    return new rxjs_1.Observable((subscriber) => {
        fs_extra_1.default.mkdirpSync(outDir);
        function toRelativePath(file) {
            const source = filesDirsOrGlobs.find((s) => file.indexOf(s) === 0);
            return source ? path_1.default.relative(source, file) : undefined;
        }
        const watcher = chokidar_1.watch(filesDirsOrGlobs, {
            ignored,
        });
        watcher
            //.on('ready', () => {
            //})
            .on('add', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                subscriber.next({
                    type: 'undefined',
                    file,
                    time: new Date(),
                });
                return;
            }
            const tofile = path_1.default.join(outDir, relpath);
            await fs_extra_1.default.mkdirp(path_1.default.dirname(tofile));
            await fs_extra_1.default.copy(file, tofile, { dereference: false });
            subscriber.next({
                type: 'added',
                file: relpath,
                time: new Date(),
            });
        })
            .on('change', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                subscriber.next({
                    type: 'undefined',
                    file,
                    time: new Date(),
                });
                return;
            }
            const tofile = path_1.default.join(outDir, relpath);
            await fs_extra_1.default.mkdirp(path_1.default.dirname(tofile));
            await fs_extra_1.default.copy(file, tofile, { dereference: false });
            subscriber.next({
                type: 'updated',
                file: relpath,
                time: new Date(),
            });
        })
            .on('unlink', async (file) => {
            const relpath = toRelativePath(file);
            if (!relpath) {
                subscriber.next({
                    type: 'undefined',
                    file,
                    time: new Date(),
                });
                return;
            }
            const tofile = path_1.default.join(outDir, relpath);
            if (fs_extra_1.default.pathExistsSync(tofile)) {
                await fs_extra_1.default.remove(tofile);
                subscriber.next({
                    type: 'removed',
                    file: relpath,
                    time: new Date(),
                });
            }
        });
        return () => {
            watcher.close();
        };
    });
}
exports.mirrorFiles = mirrorFiles;
//# sourceMappingURL=index.js.map