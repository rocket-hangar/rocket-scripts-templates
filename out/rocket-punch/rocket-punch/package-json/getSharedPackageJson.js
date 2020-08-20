"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSharedPackageJson = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fileNames_1 = require("../rule/fileNames");
function getSharedPackageJson({ cwd }) {
    const sharedConfigFile = path_1.default.join(cwd, fileNames_1.sharedPackageJsonFileName);
    return fs_extra_1.default.existsSync(sharedConfigFile) ? fs_extra_1.default.readJsonSync(sharedConfigFile) : {};
}
exports.getSharedPackageJson = getSharedPackageJson;
//# sourceMappingURL=getSharedPackageJson.js.map