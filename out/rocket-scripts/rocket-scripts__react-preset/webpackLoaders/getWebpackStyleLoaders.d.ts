import { RuleSetRule } from 'webpack';
interface GetWebpackStyleLoadersParameters {
    cssRegex: RegExp;
    cssModuleRegex: RegExp;
    extractCss: boolean;
    /** require.resolve('less-loader') */
    preProcessor?: string;
}
export declare function getWebpackStyleLoaders({ cssRegex, cssModuleRegex, extractCss, preProcessor, }: GetWebpackStyleLoadersParameters): RuleSetRule[];
export {};
