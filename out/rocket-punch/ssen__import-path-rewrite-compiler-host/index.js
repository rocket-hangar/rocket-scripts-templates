"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImportPathRewriteCompilerHost = void 0;
const import_path_rewrite_1 = require("@ssen/import-path-rewrite");
const typescript_1 = __importDefault(require("typescript"));
exports.createImportPathRewriteCompilerHost = ({ src, rootDir }) => (options, setParentNodes, compilerHost = typescript_1.default.createCompilerHost(options, setParentNodes)) => {
    // wrap getSourceFile
    function getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        // get origin compiler host result
        const sourceFile = compilerHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
        return sourceFile
            ? // if fileName starts with rootDir
                // for example, "/project/root/src/<package>/file.ts" starts with "/project/root/src/<package>"
                fileName.replace(/\\/g, '/').indexOf(rootDir.replace(/\\/g, '/')) > -1
                    ? // transform import paths in import, import(), require() and require.resolve() files
                        typescript_1.default.transform(sourceFile, [import_path_rewrite_1.importPathRewrite({ src, fileName })], options).transformed[0]
                    : sourceFile
            : undefined;
    }
    // create wrapped compiler host
    return {
        ...compilerHost,
        getSourceFile,
    };
};
//# sourceMappingURL=index.js.map