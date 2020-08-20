"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompilerOptions = void 0;
const read_tsconfig_1 = require("@ssen/read-tsconfig");
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function getCompilerOptions({ searchPath, configName, packageInfo }) {
    const { options: tsconfig } = fs_extra_1.default.existsSync(path_1.default.join(searchPath, configName))
        ? read_tsconfig_1.readTSConfig(searchPath, configName)
        : { options: {} };
    const { options: info } = read_tsconfig_1.parseTSConfig(searchPath, { compilerOptions: packageInfo.compilerOptions });
    const defaultValues = {
        downlevelIteration: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        alwaysStrict: true,
        strictNullChecks: true,
        strictBindCallApply: true,
        strictFunctionTypes: true,
        strictPropertyInitialization: true,
        resolveJsonModule: true,
        allowJs: true,
        jsx: typescript_1.default.JsxEmit.React,
        target: typescript_1.default.ScriptTarget.ES2016,
    };
    const computed = Object.keys(defaultValues).reduce((result, name) => {
        var _a, _b;
        result[name] = (_b = (_a = info[name]) !== null && _a !== void 0 ? _a : tsconfig[name]) !== null && _b !== void 0 ? _b : defaultValues[name];
        return result;
    }, {});
    return {
        ...computed,
        module: packageInfo.module === 'esm' ? typescript_1.default.ModuleKind.ES2015 : typescript_1.default.ModuleKind.CommonJS,
        moduleResolution: typescript_1.default.ModuleResolutionKind.NodeJs,
        skipLibCheck: true,
        sourceMap: true,
        declaration: true,
    };
}
exports.getCompilerOptions = getCompilerOptions;
//# sourceMappingURL=getCompilerOptions.js.map