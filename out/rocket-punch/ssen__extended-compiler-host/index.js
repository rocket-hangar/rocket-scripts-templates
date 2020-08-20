"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtendedCompilerHost = exports.targetExtensions = void 0;
const plugin_jsx_1 = __importDefault(require("@svgr/plugin-jsx"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const js_yaml_1 = require("js-yaml");
const mini_svg_data_uri_1 = __importDefault(require("mini-svg-data-uri"));
const path_1 = __importDefault(require("path"));
const typescript_1 = __importDefault(require("typescript"));
const plainTextTransformConfig = {
    getSourceText: (fileName) => {
        const file = fileName.substr(0, fileName.length - 4);
        const content = fs_extra_1.default.readFileSync(file, 'utf8');
        return `export default '${content}'`;
    },
};
const imageTransformConfig = {
    getSourceText: (fileName) => {
        const file = fileName.substr(0, fileName.length - 4);
        const ext = path_1.default.extname(file);
        const source = fs_extra_1.default.readFileSync(file, 'base64').replace(/[\r\n]+/gm, '');
        return `export default 'data:image/${ext};base64,${source}'`;
    },
};
const yamlTransformConfig = {
    getSourceText: (fileName) => {
        const file = fileName.substr(0, fileName.length - 4);
        const content = fs_extra_1.default.readFileSync(file, 'utf8');
        return `export default ${JSON.stringify(js_yaml_1.safeLoad(content))}`;
    },
};
const transformConfigs = {
    html: plainTextTransformConfig,
    ejs: plainTextTransformConfig,
    txt: plainTextTransformConfig,
    md: plainTextTransformConfig,
    yml: yamlTransformConfig,
    yaml: yamlTransformConfig,
    jpg: imageTransformConfig,
    jpeg: imageTransformConfig,
    gif: imageTransformConfig,
    png: imageTransformConfig,
    webp: imageTransformConfig,
    svg: {
        getSourceText: (fileName) => {
            const file = fileName.substr(0, fileName.length - 4);
            const svgCode = fs_extra_1.default.readFileSync(file, 'utf8').replace(/[\r\n]+/gm, '');
            const componentName = 'ReactComponent';
            const reactCode = plugin_jsx_1.default(svgCode, {}, { componentName });
            if (process.env.TS_SVG_EXPORT === 'default') {
                return reactCode;
            }
            const lines = reactCode.split('\n');
            return [
                ...lines.slice(0, lines.length - 1),
                `export default \`${mini_svg_data_uri_1.default(svgCode)}\`;`,
                `export {${componentName}};`,
            ].join('\n');
        },
    },
};
exports.targetExtensions = Object.keys(transformConfigs);
function findConfig(fileName) {
    for (const ext of exports.targetExtensions) {
        if (new RegExp(`\\.${ext}\\.tsx$`).test(fileName)) {
            return transformConfigs[ext];
        }
    }
    return undefined;
}
function createExtendedCompilerHost(options, setParentNodes, compilerHost = typescript_1.default.createCompilerHost(options, setParentNodes)) {
    function fileExists(fileName) {
        const transformConfig = findConfig(fileName);
        return !!transformConfig || compilerHost.fileExists(fileName);
    }
    function getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile) {
        const transformConfig = findConfig(fileName);
        if (transformConfig) {
            const sourceText = transformConfig.getSourceText(fileName);
            return typescript_1.default.createSourceFile(fileName, sourceText, options.target || typescript_1.default.ScriptTarget.Latest, setParentNodes, typescript_1.default.ScriptKind.TSX);
        }
        return compilerHost.getSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile);
    }
    return {
        ...compilerHost,
        fileExists,
        getSourceFile,
    };
}
exports.createExtendedCompilerHost = createExtendedCompilerHost;
//# sourceMappingURL=index.js.map