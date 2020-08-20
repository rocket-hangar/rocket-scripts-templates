"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const crypto_1 = __importDefault(require("crypto"));
function getCacheKey(fileData, filePath, configString) {
    return crypto_1.default.createHash('md5').update(fileData).update(configString).digest('hex');
}
function process(sourceText) {
    return `module.exports = '${sourceText}'`;
}
module.exports = {
    getCacheKey,
    process,
};
//# sourceMappingURL=text.js.map