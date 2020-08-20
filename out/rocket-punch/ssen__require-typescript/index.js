"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireTypescript = void 0;
const fs_1 = __importDefault(require("fs"));
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
//eslint-disable-next-line @typescript-eslint/no-explicit-any
const memo = new Map();
function requireTypescript(file) {
    const fileNames = [
        file,
        file + '.js',
        file + '.ts',
        path_1.default.join(file, 'index.ts'),
        path_1.default.join(file, 'index.js'),
    ];
    const existsFile = fileNames.find((fileName) => fs_1.default.existsSync(fileName) && fs_1.default.statSync(fileName).isFile());
    if (!existsFile) {
        throw new Error(`undefined typescript file ${file}`);
    }
    const fileDate = fs_1.default.statSync(existsFile).mtimeMs;
    const fileId = existsFile + fileDate;
    if (memo.has(fileId)) {
        return memo.get(fileId);
    }
    const source = fs_1.default.readFileSync(existsFile, { encoding: 'utf-8' });
    const result = typescript_1.default.transpileModule(source, {
        compilerOptions: {
            downlevelIteration: true,
            allowSyntheticDefaultImports: true,
            esModuleInterop: true,
            module: typescript_1.default.ModuleKind.CommonJS,
            skipLibCheck: true,
        },
    });
    //@ts-ignore hidden api
    const paths = module_1.default._nodeModulePaths(path_1.default.dirname(existsFile));
    const parent = module.parent;
    const m = new module_1.default(existsFile, parent || undefined);
    m.filename = existsFile;
    m.paths = paths;
    //@ts-ignore hidden api
    m._compile(result.outputText, existsFile);
    const output = {
        ...result,
        ...m.exports,
    };
    memo.set(fileId, output);
    return output;
}
exports.requireTypescript = requireTypescript;
//# sourceMappingURL=index.js.map