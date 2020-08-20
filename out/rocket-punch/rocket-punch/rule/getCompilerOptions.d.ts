import ts from 'typescript';
import { PackageInfo } from '../types';
interface Params {
    searchPath: string;
    configName: string;
    packageInfo: PackageInfo;
}
export declare function getCompilerOptions({ searchPath, configName, packageInfo }: Params): ts.CompilerOptions;
export {};
