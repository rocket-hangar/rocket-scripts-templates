"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const browserslist_1 = require("@rocket-scripts/browserslist");
const react_preset_1 = require("@rocket-scripts/react-preset");
const utils_1 = require("@rocket-scripts/utils");
const webpack_dev_server_1 = require("@ssen/webpack-dev-server");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const path_1 = __importDefault(require("path"));
const portfinder_1 = require("portfinder");
const InterpolateHtmlPlugin_1 = __importDefault(require("react-dev-utils/InterpolateHtmlPlugin"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const tmp_1 = __importDefault(require("tmp"));
const webpack_1 = require("webpack");
const webpack_merge_1 = require("webpack-merge");
const filterReactEnv_1 = require("./utils/filterReactEnv");
const getAppEntry_1 = require("./utils/getAppEntry");
const observeAliasChange_1 = require("./utils/observeAliasChange");
const observeAppEntryChange_1 = require("./utils/observeAppEntryChange");
async function start({ cwd = process.cwd(), app, staticFileDirectories: _staticFileDirectories = ['{cwd}/public'], env = process.env, tsconfig: _tsconfig = '{cwd}/tsconfig.json', port: _port = 'random', hostname = 'localhost', webpackConfig: _webpackConfig, webpackDevServerConfig: _webpackDevServerConfig, babelLoaderOptions: _babelLoaderOptions, logfile: _logfile = tmp_1.default.fileSync({ mode: 0o644, postfix: '.log' }).name, stdout = process.stdout, stdin = process.stdin, children, }) {
    console.log('Start Server...');
    const port = typeof _port === 'number' ? _port : await portfinder_1.getPortPromise();
    const staticFileDirectories = _staticFileDirectories.map((dir) => utils_1.icuFormat(dir, { cwd, app }));
    const appDir = path_1.default.join(cwd, 'src', app);
    const logfile = utils_1.icuFormat(_logfile, { cwd, app });
    const tsconfig = utils_1.icuFormat(_tsconfig, { cwd, app });
    const alias = utils_1.getWebpackAlias(cwd);
    const entry = getAppEntry_1.getAppEntry({ appDir });
    const publicPath = '';
    const chunkPath = '';
    const userWebpackConfig = typeof _webpackConfig === 'string'
        ? require(utils_1.icuFormat(_webpackConfig, { cwd, app }))
        : _webpackConfig !== null && _webpackConfig !== void 0 ? _webpackConfig : {};
    const userWebpackDevServerConfig = typeof _webpackDevServerConfig === 'string'
        ? require(utils_1.icuFormat(_webpackDevServerConfig, { cwd, app }))
        : _webpackDevServerConfig !== null && _webpackDevServerConfig !== void 0 ? _webpackDevServerConfig : {};
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
        extractCss: false,
    }), {
        mode: 'development',
        devtool: 'cheap-module-eval-source-map',
        output: {
            path: cwd,
            publicPath,
            filename: `${chunkPath}[name].js`,
            chunkFilename: `${chunkPath}[name].js`,
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
        plugins: [
            new webpack_1.HotModuleReplacementPlugin(),
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
    const devServerConfig = {
        ...userWebpackDevServerConfig,
        hot: true,
        compress: true,
        contentBase: staticFileDirectories,
        stats: {
            colors: false,
        },
    };
    const restartAlarm = rxjs_1.combineLatest([
        observeAppEntryChange_1.observeAppEntryChange({ appDir, current: entry }),
        observeAliasChange_1.observeAliasChange({ cwd, current: alias }),
    ]).pipe(operators_1.map((changes) => changes.filter((change) => !!change)));
    let version = '';
    try {
        version = '\n ' + require('@rocket-scripts/web/package.json').version;
    }
    catch (_a) { }
    const startParams = {
        header: utils_1.rocketTitle + version,
        hostname,
        webpackConfig,
        devServerConfig,
        port,
        cwd,
        logfile,
        stdout,
        stdin,
        restartAlarm,
        children,
    };
    const close = await webpack_dev_server_1.devServerStart(startParams);
    return {
        ...startParams,
        close,
    };
}
exports.start = start;
//# sourceMappingURL=start.js.map