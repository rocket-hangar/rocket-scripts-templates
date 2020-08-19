"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.build = void 0;
const browserslist_1 = require("@rocket-scripts/browserslist");
const react_electron_preset_1 = require("@rocket-scripts/react-electron-preset");
const utils_1 = require("@rocket-scripts/utils");
const filterReactEnv_1 = require("@rocket-scripts/web/utils/filterReactEnv");
const fs_extra_1 = __importDefault(require("fs-extra"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const postcss_safe_parser_1 = __importDefault(require("postcss-safe-parser"));
const InterpolateHtmlPlugin_1 = __importDefault(require("react-dev-utils/InterpolateHtmlPlugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const webpack_1 = __importStar(require("webpack"));
const webpack_merge_1 = require("webpack-merge");
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
async function build({ cwd = process.cwd(), app, staticFileDirectories: _staticFileDirectories = ['{cwd}/public'], outDir: _outDir = '{cwd}/out/{app}', env = process.env, tsconfig: _tsconfig = '{cwd}/tsconfig.json', mainWebpackConfig: _mainWebpackConfig, rendererWebpackConfig: _rendererWebpackConfig, babelLoaderOptions: _babelLoaderOptions, }) {
    const staticFileDirectories = _staticFileDirectories.map((dir) => utils_1.icuFormat(dir, { cwd, app }));
    const outDir = utils_1.icuFormat(_outDir, { cwd, app });
    const tsconfig = utils_1.icuFormat(_tsconfig, { cwd, app });
    const alias = utils_1.getWebpackAlias(cwd);
    const publicPath = '';
    const chunkPath = '';
    const userMainWebpackConfig = typeof _mainWebpackConfig === 'string'
        ? require(utils_1.icuFormat(_mainWebpackConfig, { cwd, app }))
        : _mainWebpackConfig !== null && _mainWebpackConfig !== void 0 ? _mainWebpackConfig : {};
    const userRendererWebpackConfig = typeof _rendererWebpackConfig === 'string'
        ? require(utils_1.icuFormat(_rendererWebpackConfig, { cwd, app }))
        : _rendererWebpackConfig !== null && _rendererWebpackConfig !== void 0 ? _rendererWebpackConfig : {};
    const webpackEnv = {
        ...filterReactEnv_1.filterReactEnv(env),
        PUBLIC_PATH: publicPath,
        PUBLIC_URL: publicPath,
        NODE_ENV: env['NODE_ENV'] || 'development',
    };
    const babelLoaderOptions = _babelLoaderOptions !== null && _babelLoaderOptions !== void 0 ? _babelLoaderOptions : {
        presets: [
            [
                require.resolve('@rocket-scripts/react-preset/babelPreset'),
                {
                    modules: false,
                    targets: browserslist_1.getBrowserslistQuery({ cwd }),
                },
            ],
        ],
    };
    const mainWebpackConfig = webpack_merge_1.merge(userMainWebpackConfig, react_electron_preset_1.mainWebpackConfig({
        cwd,
        babelLoaderOptions,
        tsconfig,
    }), {
        mode: 'production',
        output: {
            path: outDir,
            filename: `[name].js`,
            chunkFilename: `[name].js`,
            pathinfo: false,
        },
        resolve: {
            symlinks: false,
            alias,
        },
        entry: {
            main: path_1.default.join(cwd, `src/${app}/main`),
            preload: path_1.default.join(cwd, `src/${app}/preload`),
        },
        externals: [
            webpack_node_externals_1.default({
                allowlist: [
                    // include asset files
                    /\.(?!(?:jsx?|json)$).{1,5}$/i,
                ],
            }),
        ],
        optimization: {
            concatenateModules: true,
            minimize: true,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        ecma: 5,
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            //ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: true,
                }),
            ],
        },
        plugins: [
            new webpack_1.DefinePlugin({
                'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
                    stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
                    return stringifiedEnv;
                }, {}),
            }),
        ],
    });
    const rendererWebpackConfig = webpack_merge_1.merge(userRendererWebpackConfig, react_electron_preset_1.rendererWebpackConfig({
        cwd,
        tsconfig,
        babelLoaderOptions,
        chunkPath,
        publicPath,
        extractCss: true,
    }), {
        mode: 'production',
        output: {
            path: outDir,
            filename: `[name].js`,
            chunkFilename: `[name].js`,
            pathinfo: false,
        },
        resolve: {
            symlinks: false,
            alias,
        },
        entry: {
            renderer: path_1.default.join(cwd, `src/${app}/renderer`),
        },
        optimization: {
            concatenateModules: true,
            minimize: true,
            minimizer: [
                new terser_webpack_plugin_1.default({
                    terserOptions: {
                        ecma: 5,
                        parse: {
                            ecma: 8,
                        },
                        compress: {
                            //ecma: 5,
                            warnings: false,
                            comparisons: false,
                            inline: 2,
                        },
                        mangle: {
                            safari10: true,
                        },
                        output: {
                            ecma: 5,
                            comments: false,
                            ascii_only: true,
                        },
                    },
                    parallel: true,
                    cache: true,
                    sourceMap: true,
                }),
                new optimize_css_assets_webpack_plugin_1.default({
                    cssProcessorOptions: {
                        parser: postcss_safe_parser_1.default,
                        map: {
                            inline: false,
                            annotation: true,
                        },
                    },
                    cssProcessorPluginOptions: {
                        preset: ['default', { minifyFontValues: { removeQuotes: false } }],
                    },
                }),
            ],
            splitChunks: {
                cacheGroups: {
                    // vendor chunk
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendor',
                        chunks: 'all',
                    },
                    // extract single css file
                    style: {
                        test: (m) => m.constructor.name === 'CssModule',
                        name: 'style',
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        plugins: [
            new mini_css_extract_plugin_1.default({
                filename: `[name].css`,
            }),
            new html_webpack_plugin_1.default({
                template: path_1.default.join(cwd, `src/${app}/index.html`),
                filename: 'index.html',
            }),
            new InterpolateHtmlPlugin_1.default(html_webpack_plugin_1.default, webpackEnv),
            new webpack_1.DefinePlugin({
                'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
                    stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
                    return stringifiedEnv;
                }, {}),
            }),
        ],
    });
    await fs_extra_1.default.mkdirp(outDir);
    await Promise.all(staticFileDirectories.map((dir) => fs_extra_1.default.copy(dir, outDir, { dereference: true })));
    const mainCompiler = webpack_1.default(mainWebpackConfig);
    const rendererCompiler = webpack_1.default(rendererWebpackConfig);
    await new Promise((resolve, reject) => {
        mainCompiler.run((error, stats) => {
            var _a;
            if (error) {
                reject(error);
            }
            else {
                console.log(stats.toString(typeof mainWebpackConfig.stats === 'object'
                    ? {
                        colors: true,
                    }
                    : (_a = mainWebpackConfig.stats) !== null && _a !== void 0 ? _a : { colors: true }));
                resolve();
            }
        });
    });
    await new Promise((resolve, reject) => {
        rendererCompiler.run((error, stats) => {
            var _a;
            if (error) {
                reject(error);
            }
            else {
                console.log(stats.toString(typeof rendererWebpackConfig.stats === 'object'
                    ? {
                        colors: true,
                    }
                    : (_a = rendererWebpackConfig.stats) !== null && _a !== void 0 ? _a : { colors: true }));
                resolve();
            }
        });
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map