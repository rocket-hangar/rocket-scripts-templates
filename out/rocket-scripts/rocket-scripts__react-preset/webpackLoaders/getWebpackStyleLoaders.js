"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebpackStyleLoaders = void 0;
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const getCSSModuleLocalIdent_1 = __importDefault(require("react-dev-utils/getCSSModuleLocalIdent"));
function getWebpackStyleLoaders({ cssRegex, cssModuleRegex, extractCss, preProcessor, }) {
    const styleLoader = extractCss
        ? mini_css_extract_plugin_1.default.loader
        : require.resolve('style-loader');
    const postcssLoader = {
        loader: require.resolve('postcss-loader'),
        options: {
            // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/webpack.config.js#L99
            ident: 'postcss',
            plugins: () => [
                require('postcss-flexbugs-fixes'),
                require('postcss-preset-env')({
                    autoprefixer: {
                        flexbox: 'no-2009',
                    },
                    stage: 3,
                }),
                require('postcss-normalize')(),
            ],
            sourceMap: true,
        },
    };
    const use = [
        styleLoader,
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                importLoaders: preProcessor ? 2 : 1,
                sourceMap: true,
            },
        },
        postcssLoader,
    ];
    const moduleUse = [
        styleLoader,
        {
            loader: require.resolve('css-loader'),
            options: {
                url: false,
                importLoaders: preProcessor ? 2 : 1,
                sourceMap: true,
                modules: true,
                getLocalIdent: getCSSModuleLocalIdent_1.default,
            },
        },
        postcssLoader,
    ];
    if (preProcessor) {
        const preProcessorLoader = {
            loader: preProcessor,
            options: {
                sourceMap: true,
                ...(preProcessor.indexOf('less-loader') > -1 ? { javascriptEnabled: true } : {}),
            },
        };
        use.push(preProcessorLoader);
        moduleUse.push(preProcessorLoader);
    }
    return [
        {
            test: cssModuleRegex,
            use: moduleUse,
        },
        {
            test: cssRegex,
            use,
        },
    ];
}
exports.getWebpackStyleLoaders = getWebpackStyleLoaders;
//# sourceMappingURL=getWebpackStyleLoaders.js.map