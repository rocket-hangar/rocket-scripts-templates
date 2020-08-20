"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readEntry = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const path_1 = __importDefault(require("path"));
const fileNames_1 = require("../rule/fileNames");
function readEntry({ cwd }) {
    const source = fs_extra_1.default.readFileSync(path_1.default.join(cwd, fileNames_1.packagesFileName), {
        encoding: 'utf8',
    });
    const content = js_yaml_1.default.safeLoad(source);
    if (!content || typeof content === 'string') {
        throw new Error(`yaml.safeLoad does not return an object`);
    }
    return content;
}
exports.readEntry = readEntry;
//# sourceMappingURL=readEntry.js.map