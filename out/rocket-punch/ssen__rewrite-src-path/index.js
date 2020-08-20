"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriteSrcPath = void 0;
const path_1 = __importDefault(require("path"));
function toPackageName(fullPath) {
    const p = fullPath.replace(/\\/g, '/');
    if (/^@/.test(p)) {
        return p.split('/').splice(0, 2).join('/');
    }
    else {
        return p.split('/')[0];
    }
}
function rewriteSrcPath({ importPath, filePath, rootDir }) {
    if (/^\.\./.test(importPath)) {
        const dir = path_1.default.dirname(filePath);
        const targetFilePath = path_1.default.join(dir, importPath);
        const packageName = toPackageName(path_1.default.relative(rootDir, filePath));
        const targetPackageName = toPackageName(path_1.default.relative(rootDir, targetFilePath));
        return packageName !== targetPackageName ? targetPackageName : importPath;
    }
    return importPath;
}
exports.rewriteSrcPath = rewriteSrcPath;
//# sourceMappingURL=index.js.map