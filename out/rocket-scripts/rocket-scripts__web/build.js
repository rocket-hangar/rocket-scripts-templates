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
const react_preset_1 = require("@rocket-scripts/react-preset");
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
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_merge_1 = require("webpack-merge");
const getAppEntry_1 = require("./utils/getAppEntry");
async function build({ cwd = process.cwd(), app, staticFileDirectories: _staticFileDirectories = ['{cwd}/public'], outDir: _outDir = '{cwd}/out/{app}', env = {}, tsconfig: _tsconfig = '{cwd}/tsconfig.json', webpackConfig: _webpackConfig, babelLoaderOptions: _babelLoaderOptions, devtool = 'source-map', }) {
    const outDir = utils_1.icuFormat(_outDir, { cwd, app });
    const staticFileDirectories = _staticFileDirectories.map((dir) => utils_1.icuFormat(dir, { cwd, app }));
    const appDir = path_1.default.join(cwd, 'src', app);
    const tsconfig = utils_1.icuFormat(_tsconfig, { cwd, app });
    const alias = utils_1.getWebpackAlias(cwd);
    const entry = getAppEntry_1.getAppEntry({ appDir });
    const publicPath = '';
    const chunkPath = '';
    const userWebpackConfig = typeof _webpackConfig === 'string'
        ? require(utils_1.icuFormat(_webpackConfig, { cwd, app }))
        : _webpackConfig !== null && _webpackConfig !== void 0 ? _webpackConfig : {};
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
    const webpackConfig = webpack_merge_1.merge(userWebpackConfig, react_preset_1.webpackConfig({
        chunkPath,
        publicPath,
        cwd,
        tsconfig,
        babelLoaderOptions,
        extractCss: true,
    }), {
        mode: 'production',
        devtool,
        output: {
            path: outDir,
            publicPath,
            filename: `${chunkPath}[name].[hash].js`,
            chunkFilename: `${chunkPath}[name].[hash].js`,
            pathinfo: false,
        },
        resolve: {
            symlinks: false,
            alias,
        },
        entry: entry.reduce((e, { name, index }) => {
            e[name] = path_1.default.join(cwd, 'src', app, index);
            return e;
        }, {}),
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
            // create css files
            new mini_css_extract_plugin_1.default({
                filename: `${chunkPath}[name].[hash].css`,
                chunkFilename: `${chunkPath}[name].[hash].css`,
            }),
            // create size report
            new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({
                analyzerMode: 'static',
                reportFilename: path_1.default.join(outDir, 'size-report.html'),
                openAnalyzer: false,
            }),
            //create html files
            ...entry.map(({ html }) => new html_webpack_plugin_1.default({
                template: path_1.default.join(cwd, 'src', app, html),
                filename: html,
            })),
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
    const compiler = webpack_1.default(webpackConfig);
    await new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
            var _a;
            if (error) {
                reject(error);
            }
            else {
                console.log(stats.toString(typeof webpackConfig.stats === 'object'
                    ? {
                        colors: true,
                    }
                    : (_a = webpackConfig.stats) !== null && _a !== void 0 ? _a : { colors: true }));
                resolve();
            }
        });
    });
}
exports.build = build;
//# sourceMappingURL=build.js.map