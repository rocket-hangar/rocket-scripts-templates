"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fsCopyFilter = void 0;
const extended_compiler_host_1 = require("@ssen/extended-compiler-host");
const fs_extra_1 = __importDefault(require("fs-extra"));
const bundleExtensions = new RegExp(`.(${extended_compiler_host_1.targetExtensions.join('|')})$`);
// if the file bundled by like `import text from './some.txt'`
// it does not copy
function isBundled(dest) {
    return bundleExtensions.test(dest) && fs_extra_1.default.existsSync(dest + '.js');
}
// prettier-ignore
function fsCopyFilter(src, dest) {
    const s = src.replace(/\\/g, '/');
    const completelyIgnore = /__(\w*)__/.test(s); // __tests__ , __fixtures__
    const ignore = /\.(ts|tsx|mjs|js|jsx)$/.test(s) || // *.ts, *.tsx, *.js, *.jsx, *.mjs
        isBundled(dest); // *.txt, *.md, *.yml...
    const pass = !completelyIgnore &&
        (!ignore ||
            /\.d\.ts$/.test(s) || // *.d.ts
            /\/bin\/[a-zA-Z0-9._-]+.js$/.test(s) || // bin/*.js
            /\/public\//.test(s) // public/*
        );
    //if (pass && !process.env.JEST_WORKER_ID) {
    //if (fs.statSync(s).isFile()) console.log('COPY:', s);
    //}
    return pass;
}
exports.fsCopyFilter = fsCopyFilter;
//# sourceMappingURL=fsCopyFilter.js.map