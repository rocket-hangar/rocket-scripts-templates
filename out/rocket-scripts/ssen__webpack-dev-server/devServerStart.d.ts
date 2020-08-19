/// <reference types="node" />
import { ReactNode } from 'react';
import { Observable } from 'rxjs';
import { DevServerParams } from './DevServer';
export interface DevServerStartParams extends DevServerParams {
    stdout?: NodeJS.WriteStream;
    stdin?: NodeJS.ReadStream;
    header?: ReactNode;
    cwd?: string;
    logfile?: string;
    restartAlarm?: Observable<string[]>;
}
export declare function devServerStart({ stdout, stdin, header, cwd, logfile, port, hostname, webpackConfig, devServerConfig, restartAlarm, }: DevServerStartParams): Promise<() => Promise<void>>;
