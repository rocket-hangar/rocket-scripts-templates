/// <reference types="webpack-dev-server" />
/// <reference types="node" />
import { ElectronSwitchesYargsValues } from '@ssen/electron-switches';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';
import { Configuration as WebpackConfiguration } from 'webpack';
export interface DevServerStartParams {
    mainWebpackConfig: WebpackConfiguration;
    rendererWebpackConfig: WebpackConfiguration;
    staticFileDirectories?: string[];
    stdout?: NodeJS.WriteStream;
    stdin?: NodeJS.ReadStream;
    header?: ReactNode;
    cwd?: string;
    outDir?: string;
    logfile?: string;
    electronSwitches?: ElectronSwitchesYargsValues;
    restartAlarm?: Observable<string[]>;
}
export declare function devServerStart({ mainWebpackConfig, rendererWebpackConfig, staticFileDirectories, stdout, stdin, header, cwd, outDir, logfile, electronSwitches, restartAlarm, }: DevServerStartParams): Promise<() => Promise<void>>;
