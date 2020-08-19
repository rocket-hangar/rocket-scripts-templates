"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const browserslist_1 = require("@rocket-scripts/browserslist");
const react_electron_preset_1 = require("@rocket-scripts/react-electron-preset");
const utils_1 = require("@rocket-scripts/utils");
const filterReactEnv_1 = require("@rocket-scripts/web/utils/filterReactEnv");
const observeAliasChange_1 = require("@rocket-scripts/web/utils/observeAliasChange");
const electron_dev_server_1 = require("@ssen/electron-dev-server");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const path_1 = __importDefault(require("path"));
const InterpolateHtmlPlugin_1 = __importDefault(require("react-dev-utils/InterpolateHtmlPlugin"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tmp_1 = __importDefault(require("tmp"));
const webpack_1 = require("webpack");
const webpack_merge_1 = require("webpack-merge");
const webpack_node_externals_1 = __importDefault(require("webpack-node-externals"));
async function start({ cwd = process.cwd(), app, staticFileDirectories: _staticFileDirectories = ['{cwd}/public'], outDir: _outDir = '{cwd}/dev/{app}', electronSwitches = {}, env = process.env, tsconfig: _tsconfig = '{cwd}/tsconfig.json', mainWebpackConfig: _mainWebpackConfig, rendererWebpackConfig: _rendererWebpackConfig, babelLoaderOptions: _babelLoaderOptions, logfile: _logfile = tmp_1.default.fileSync({ mode: 0o644, postfix: '.log' }).name, stdout = process.stdout, stdin = process.stdin, }) {
    console.log('Start Server...');
    const staticFileDirectories = _staticFileDirectories.map((dir) => utils_1.icuFormat(dir, { cwd, app }));
    const outDir = utils_1.icuFormat(_outDir, { cwd, app });
    const tsconfig = utils_1.icuFormat(_tsconfig, { cwd, app });
    const alias = utils_1.getWebpackAlias(cwd);
    const logfile = utils_1.icuFormat(_logfile, { cwd, app });
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
        mode: 'development',
        devtool: 'source-map',
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
        plugins: [
            new webpack_1.DefinePlugin({
                'process.env': Object.keys(webpackEnv).reduce((stringifiedEnv, key) => {
                    stringifiedEnv[key] = JSON.stringify(webpackEnv[key]);
                    return stringifiedEnv;
                }, {}),
            }),
        ],
        performance: {
            hints: false,
        },
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
            moduleIds: 'named',
            noEmitOnErrors: true,
        },
    });
    const rendererWebpackConfig = webpack_merge_1.merge(userRendererWebpackConfig, react_electron_preset_1.rendererWebpackConfig({
        cwd,
        tsconfig,
        babelLoaderOptions,
        chunkPath,
        publicPath,
        extractCss: true,
    }), {
        mode: 'development',
        devtool: 'source-map',
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
        performance: {
            hints: false,
        },
        optimization: {
            removeAvailableModules: false,
            removeEmptyChunks: false,
            splitChunks: false,
            moduleIds: 'named',
            noEmitOnErrors: true,
        },
    });
    const restartAlarm = rxjs_1.combineLatest([
        observeAliasChange_1.observeAliasChange({ cwd, current: alias }),
    ]).pipe(operators_1.map((changes) => changes.filter((change) => !!change)));
    let version = '';
    try {
        version = '\n ' + require('@rocket-scripts/electron/package.json').version;
    }
    catch (_a) { }
    const startParams = {
        header: utils_1.rocketTitle + version,
        cwd,
        outDir,
        staticFileDirectories,
        mainWebpackConfig,
        rendererWebpackConfig,
        electronSwitches,
        stdin,
        stdout,
        restartAlarm,
        logfile,
    };
    const close = await electron_dev_server_1.devServerStart(startParams);
    return {
        ...startParams,
        close,
    };
}
exports.start = start;
//# sourceMappingURL=start.js.map