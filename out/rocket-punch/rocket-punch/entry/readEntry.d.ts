import { PackageConfig } from '../types';
interface Params {
    cwd: string;
}
export declare function readEntry({ cwd }: Params): Record<string, string | PackageConfig>;
export {};
