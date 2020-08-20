import { PackageJson } from 'type-fest';
interface Params {
    packageJsonContents: PackageJson[];
}
export declare function getPackagesOrder({ packageJsonContents }: Params): string[];
export {};
