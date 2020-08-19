"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackConfig = exports.babelPreset = exports.jestPreset = void 0;
const babelPreset_1 = __importDefault(require("./babelPreset"));
exports.babelPreset = babelPreset_1.default;
const jestPreset_1 = __importDefault(require("./jestPreset"));
exports.jestPreset = jestPreset_1.default;
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
exports.webpackConfig = webpackConfig_1.default;
//# sourceMappingURL=index.js.map