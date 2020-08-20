import { BuildParams } from './params';
export declare function build({ cwd, sourceRoot, dist, tsconfig, entry, svg, transformPackageJson, transformCompilerHost, transformCompilerOptions, emitCustomTransformers, onMessage, }: BuildParams): Promise<void>;
