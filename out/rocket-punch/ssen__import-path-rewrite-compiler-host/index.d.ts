import ts from 'typescript';
interface Configuration {
    /**
     * source root
     *
     * /project/root/src
     */
    src: string;
    /**
     * package source directory
     *
     * /project/root/src/<package>
     */
    rootDir: string;
}
export declare const createImportPathRewriteCompilerHost: ({ src, rootDir }: Configuration) => (options: ts.CompilerOptions, setParentNodes?: boolean | undefined, compilerHost?: ts.CompilerHost) => ts.CompilerHost;
export {};
