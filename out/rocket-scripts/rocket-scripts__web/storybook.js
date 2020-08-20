"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpackFinal = void 0;
const utils_1 = require("@rocket-scripts/utils");
const webpack_merge_1 = require("webpack-merge");
exports.webpackFinal = ({ cwd = process.cwd() }) => async (config) => {
    const alias = utils_1.getWebpackAlias(cwd);
    return webpack_merge_1.merge(config, {
        resolve: {
            alias,
        },
    });
};
//# sourceMappingURL=storybook.js.map