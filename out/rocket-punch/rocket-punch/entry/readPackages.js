"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readPackages = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
async function readPackages({ cwd, sourceRoot, entry }) {
    const packages = {};
    for (const name of Object.keys(entry)) {
        if (/\/\*$/.test(name)) {
            const groupName = name.split('/')[0];
            const dir = path_1.default.resolve(cwd, sourceRoot, groupName);
            const files = await fs_extra_1.default.readdir(dir);
            for (const pkgName of files) {
                const pkgDir = path_1.default.join(dir, pkgName);
                const groupAndPkgName = groupName + '/' + pkgName;
                if (fs_extra_1.default.statSync(pkgDir).isDirectory() &&
                    fs_extra_1.default.readdirSync(pkgDir).length > 0 &&
                    !packages[groupAndPkgName]) {
                    packages[groupName + '/' + pkgName] = entry[name];
                }
            }
        }
        else if (!packages[name]) {
            packages[name] = entry[name];
        }
    }
    return Object.keys(packages).reduce((map, name) => {
        var _a, _b, _c;
        const versionOrInfo = packages[name];
        if (typeof versionOrInfo === 'string') {
            map.set(name, {
                name,
                version: versionOrInfo,
                tag: 'latest',
                module: 'esm',
                access: undefined,
                registry: undefined,
                compilerOptions: {},
                packageJson: {},
            });
        }
        else {
            map.set(name, {
                name,
                version: versionOrInfo.version,
                tag: (_a = versionOrInfo.tag) !== null && _a !== void 0 ? _a : 'latest',
                module: versionOrInfo.module === 'esm' ? 'esm' : 'commonjs',
                access: versionOrInfo.access,
                registry: versionOrInfo.registry,
                compilerOptions: (_b = versionOrInfo.compilerOptions) !== null && _b !== void 0 ? _b : {},
                packageJson: (_c = versionOrInfo.packageJson) !== null && _c !== void 0 ? _c : {},
            });
        }
        return map;
    }, new Map());
}
exports.readPackages = readPackages;
//# sourceMappingURL=readPackages.js.map