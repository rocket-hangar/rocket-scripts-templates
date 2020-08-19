"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eslintConfigExistsSync = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
// https://github.com/eslint/eslint/blob/master/lib/cli-engine/config-array-factory.js#L52
const configFilenames = [
    '.eslintrc.js',
    '.eslintrc.cjs',
    '.eslintrc.yaml',
    '.eslintrc.yml',
    '.eslintrc.json',
    '.eslintrc',
];
function eslintConfigExistsSync(cwd) {
    try {
        if (typeof require.resolve('eslint-loader') !== 'string' ||
            typeof require.resolve('eslint') !== 'string') {
            return false;
        }
    }
    catch (_a) {
        return false;
    }
    for (const filename of configFilenames) {
        if (fs_extra_1.default.existsSync(path_1.default.join(cwd, filename))) {
            return true;
        }
    }
    const packageJson = path_1.default.join(cwd, 'package.json');
    if (!fs_extra_1.default.existsSync(packageJson))
        return false;
    const { eslintConfig } = fs_extra_1.default.readJsonSync(packageJson);
    return typeof eslintConfig === 'object';
}
exports.eslintConfigExistsSync = eslintConfigExistsSync;
//# sourceMappingURL=eslintConfigExistsSync.js.map