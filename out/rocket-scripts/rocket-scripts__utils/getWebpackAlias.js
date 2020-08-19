"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackAlias = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getWebpackAlias(cwd) {
    const src = path_1.default.join(cwd, 'src');
    const alias = {};
    const names = fs_extra_1.default
        .readdirSync(src)
        .filter((name) => fs_extra_1.default.statSync(path_1.default.join(src, name)).isDirectory());
    for (const name of names) {
        const dir = path_1.default.join(src, name);
        if (/^@/.test(name)) {
            const subnames = fs_extra_1.default
                .readdirSync(dir)
                .filter((subname) => fs_extra_1.default.statSync(path_1.default.join(dir, subname)).isDirectory());
            for (const subname of subnames) {
                const subdir = path_1.default.join(dir, subname);
                alias[`${name}/${subname}`] = path_1.default.resolve(cwd, subdir);
            }
        }
        else {
            alias[name] = path_1.default.resolve(cwd, dir);
        }
    }
    return alias;
}
exports.getWebpackAlias = getWebpackAlias;
//# sourceMappingURL=getWebpackAlias.js.map