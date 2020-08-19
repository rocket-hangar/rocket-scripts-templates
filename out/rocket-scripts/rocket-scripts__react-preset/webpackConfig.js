"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const eslintConfigExistsSync_1 = require("@rocket-scripts/utils/eslintConfigExistsSync");
const fork_ts_checker_webpack_plugin_1 = __importDefault(require("fork-ts-checker-webpack-plugin"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const getWebpackDataURILoaders_1 = require("./webpackLoaders/getWebpackDataURILoaders");
const getWebpackFileLoaders_1 = require("./webpackLoaders/getWebpackFileLoaders");
const getWebpackMDXLoaders_1 = require("./webpackLoaders/getWebpackMDXLoaders");
const getWebpackRawLoaders_1 = require("./webpackLoaders/getWebpackRawLoaders");
const getWebpackScriptLoaders_1 = require("./webpackLoaders/getWebpackScriptLoaders");
const getWebpackStyleLoaders_1 = require("./webpackLoaders/getWebpackStyleLoaders");
const getWebpackYamlLoaders_1 = require("./webpackLoaders/getWebpackYamlLoaders");
function default_1({ cwd, chunkPath, publicPath, babelLoaderOptions, tsconfig, extractCss, }) {
    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx', '.json', '.mdx'],
        },
        module: {
            strictExportPresence: true,
            rules: [
                ...(() => {
                    try {
                        return eslintConfigExistsSync_1.eslintConfigExistsSync(cwd)
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
                            : [];
                    }
                    catch (_a) {
                        return [];
                    }
                })(),
                {
                    oneOf: [
                        // convert small image files to data uri
                        ...getWebpackDataURILoaders_1.getWebpackDataURILoaders({ chunkPath }),
                        // ts, tsx, js, jsx - script
                        ...getWebpackScriptLoaders_1.getWebpackScriptLoaders({
                            include: path_1.default.join(cwd, 'src'),
                            babelLoaderOptions,
                            useWebWorker: true,
                            chunkPath,
                            publicPath,
                        }),
                        // mdx - script
                        ...getWebpackMDXLoaders_1.getWebpackMDXLoaders({
                            include: path_1.default.join(cwd, 'src'),
                            babelLoaderOptions,
                        }),
                        // html, ejs, txt, md - plain text
                        ...getWebpackRawLoaders_1.getWebpackRawLoaders(),
                        // yaml, yml
                        ...getWebpackYamlLoaders_1.getWebpackYamlLoaders(),
                        // css, scss, sass, less - style
                        // module.* - css module
                        ...(() => {
                            const styleLoaders = [
                                ...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                                    cssRegex: /\.css$/,
                                    cssModuleRegex: /\.module.css$/,
                                    extractCss,
                                }),
                            ];
                            try {
                                if (require.resolve('node-sass').length > 0) {
                                    styleLoaders.push(...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                                        cssRegex: /\.(scss|sass)$/,
                                        cssModuleRegex: /\.module.(scss|sass)$/,
                                        extractCss,
                                        preProcessor: require.resolve('sass-loader'),
                                    }));
                                }
                            }
                            catch (_a) { }
                            try {
                                if (require.resolve('less').length > 0) {
                                    styleLoaders.push(...getWebpackStyleLoaders_1.getWebpackStyleLoaders({
                                        cssRegex: /\.less$/,
                                        cssModuleRegex: /\.module.less$/,
                                        extractCss,
                                        preProcessor: require.resolve('less-loader'),
                                    }));
                                }
                            }
                            catch (_b) { }
                            return styleLoaders;
                        })(),
                        // export files to static directory
                        ...getWebpackFileLoaders_1.getWebpackFileLoaders({
                            chunkPath,
                        }),
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
//# sourceMappingURL=webpackConfig.js.map