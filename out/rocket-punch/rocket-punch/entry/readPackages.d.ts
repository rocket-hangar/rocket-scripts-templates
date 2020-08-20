import { PackageConfig, PackageInfo } from '../types';
interface Params {
    cwd: string;
    sourceRoot: string;
    entry: Record<string, string | PackageConfig>;
}
export declare function readPackages({ cwd, sourceRoot, entry }: Params): Promise<Map<string, PackageInfo>>;
export {};
