declare const _default: {
    readonly roots: readonly ["<rootDir>/src"];
    readonly transform: {
        readonly '\\.(ts|tsx|js|jsx)$': string;
        readonly '\\.(svg)$': string;
        readonly '\\.(html|ejs|txt|md)$': string;
        readonly '\\.(yaml|yml)$': string;
    };
    readonly moduleNameMapper: {
        readonly '\\.(bmp|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': string;
        readonly '\\.(css|less|sass|scss)$': string;
        readonly '\\.(mdx)$': string;
    };
    readonly setupFilesAfterEnv: readonly [string];
    readonly testMatch: readonly ["**/__test?(s)__/**/*.ts?(x)", "**/?(*.)(spec|test).ts?(x)"];
    readonly moduleFileExtensions: readonly ["ts", "tsx", "js", "jsx", "json", "yaml", "yml", "svg"];
    readonly collectCoverageFrom: readonly ["src/**/*.ts?(x)", "!**/*.d.ts?(x)", "!**/__*__/**", "!**/bin/**", "!**/public/**"];
    readonly modulePaths: readonly ["<rootDir>/src/"];
};
export = _default;
