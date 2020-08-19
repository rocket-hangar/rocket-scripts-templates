"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getWebpackRawLoaders_1 = require("@rocket-scripts/react-preset/webpackLoaders/getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("@rocket-scripts/react-preset/webpackLoaders/getWebpackScriptLoaders");
const getWebpackYamlLoaders_1 = require("@rocket-scripts/react-preset/webpackLoaders/getWebpackYamlLoaders");
const utils_1 = require("@rocket-scripts/utils");
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
function default_1({ cwd, babelLoaderOptions, tsconfig }) {
    return {
        target: 'electron-main',
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json'],
            mainFields: ['main'],
        },
        output: {
            libraryTarget: 'commonjs2',
        },
        module: {
            strictExportPresence: true,
            rules: [
                ...(utils_1.eslintConfigExistsSync(cwd)
                    ? [
                        {
                            test: /\.(js|mjs|jsx|ts|tsx)$/,
                            include: path_1.default.join(cwd, 'src'),
                            enforce: 'pre',
                            use: [
                                {
                                    loader: require.resolve('eslint-loader'),
                                    options: {
                                        eslintPath: require.resolve('eslint'),
                                        cwd,
                                    },
                                },
                            ],
                        },
                    ]
                    : []),
                {
                    oneOf: [
                        // ts, tsx, js, jsx - script
                        ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                            include: path_1.default.join(cwd, 'src'),
                            babelLoaderOptions,
                            useWebWorker: true,
                            chunkPath: '',
                            publicPath: '',
                        }),
                        // html, ejs, txt, md - plain text
                        ...getWebpackRawLoaders_1.getWebpackRawLoaders(),
                        // yaml, yml
                        ...getWebpackYamlLoaders_1.getWebpackYamlLoaders(),
                    ],
                },
            ],
        },
        plugins: [
            new webpack_1.WatchIgnorePlugin([path_1.default.join(cwd, 'node_modules')]),
            ...(fs_extra_1.default.existsSync(tsconfig)
                ? [
                    new fork_ts_checker_webpack_plugin_1.default({
                        async: false,
                        typescript: {
                            configFile: tsconfig,
                            diagnosticOptions: {
                                semantic: true,
                                syntactic: true,
                            },
                            configOverwrite: {
                                compilerOptions: {
                                    incremental: true,
                                },
                            },
                        },
                        formatter: {
                            type: 'codeframe',
                            options: {
                                highlightCode: false,
                            },
                        },
                    }),
                ]
                : []),
        ],
        resolveLoader: {
            modules: ['node_modules'],
        },
        node: {
            module: 'empty',
            dgram: 'empty',
            dns: 'mock',
            fs: 'empty',
            http2: 'empty',
            net: 'empty',
            tls: 'empty',
            child_process: 'empty',
        },
    };
}
exports.default = default_1;
//# sourceMappingURL=mainWebpackConfig.js.map