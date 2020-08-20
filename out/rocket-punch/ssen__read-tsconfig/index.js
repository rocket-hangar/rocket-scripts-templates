"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTSConfig = exports.readTSConfig = void 0;
const typescript_1 = __importDefault(require("typescript"));
const parseConfigHost = {
    fileExists: typescript_1.default.sys.fileExists,
    readFile: typescript_1.default.sys.readFile,
    readDirectory: typescript_1.default.sys.readDirectory,
    useCaseSensitiveFileNames: true,
};
function readTSConfig(searchPath, configName = 'tsconfig.json') {
    const configFileName = typescript_1.default.findConfigFile(searchPath, typescript_1.default.sys.fileExists, configName);
    if (!configFileName)
        throw new Error(`Undefined "${configName}" file on "${searchPath}"`);
    const { config, error } = typescript_1.default.readConfigFile(configFileName, typescript_1.default.sys.readFile);
    if (error) {
        throw error;
    }
    else if (!config) {
        throw new Error(`It was not generated config from readConfigFile("${configFileName}")`);
    }
    return typescript_1.default.parseJsonConfigFileContent(config, parseConfigHost, searchPath);
}
exports.readTSConfig = readTSConfig;
function parseTSConfig(searchPath, tsconfig) {
    return typescript_1.default.parseJsonConfigFileContent(tsconfig, parseConfigHost, searchPath);
}
exports.parseTSConfig = parseTSConfig;
//# sourceMappingURL=index.js.map