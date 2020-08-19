"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const build_1 = require("babel-jest/build");
const babelPreset_1 = __importDefault(require("../../babelPreset"));
module.exports = build_1.createTransformer({
    ...babelPreset_1.default(null, { modules: 'commonjs', targets: 'current node' }),
});
//# sourceMappingURL=script.js.map