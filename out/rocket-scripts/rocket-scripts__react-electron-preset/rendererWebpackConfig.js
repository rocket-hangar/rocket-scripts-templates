"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpackConfig_1 = __importDefault(require("@rocket-scripts/react-preset/webpackConfig"));
const webpack_merge_1 = require("webpack-merge");
function default_1({ cwd, babelLoaderOptions, chunkPath, publicPath, tsconfig, extractCss, }) {
    return webpack_merge_1.merge(webpackConfig_1.default({
        cwd,
        babelLoaderOptions,
        chunkPath,
        publicPath,
        tsconfig,
        extractCss,
    }), {
        target: 'electron-renderer',
    });
}
exports.default = default_1;
//# sourceMappingURL=rendererWebpackConfig.js.map