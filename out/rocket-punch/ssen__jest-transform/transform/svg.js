"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const plugin_jsx_1 = __importDefault(require("@svgr/plugin-jsx"));
const crypto_1 = __importDefault(require("crypto"));
const mini_svg_data_uri_1 = __importDefault(require("mini-svg-data-uri"));
const typescript_1 = __importDefault(require("typescript"));
function getCacheKey(fileData, filePath, configString) {
    return crypto_1.default.createHash('md5').update(fileData).update(configString).digest('hex');
}
function processFunction(sourceText) {
    const svgCode = sourceText.replace(/[\r\n]+/gm, '');
    const componentName = 'ReactComponent';
    const reactCode = plugin_jsx_1.default(svgCode, {}, { componentName });
    const lines = reactCode.split('\n');
    const output = process.env.TS_SVG_EXPORT === 'default'
        ? [...lines.slice(0, lines.length - 1), `export default ${componentName}`].join('\n')
        : [
            ...lines.slice(0, lines.length - 1),
            `export default \`${mini_svg_data_uri_1.default(svgCode)}\`;`,
            `export {${componentName}};`,
        ].join('\n');
    return typescript_1.default.transpileModule(output, {
        compilerOptions: { module: typescript_1.default.ModuleKind.CommonJS, jsx: typescript_1.default.JsxEmit.React },
    }).outputText;
}
module.exports = {
    getCacheKey,
    process: processFunction,
};
//# sourceMappingURL=svg.js.map