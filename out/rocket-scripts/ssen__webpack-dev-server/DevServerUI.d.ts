import { ReactNode } from 'react';
import { Observable } from 'rxjs';
import { DevServer } from './DevServer';
import { TimeMessage } from './types';
export interface DevServerUIProps {
    header?: ReactNode;
    devServer: DevServer;
    cwd: string;
    logfile: string;
    proxyMessage?: Observable<TimeMessage[]>;
    restartAlarm?: Observable<string[]>;
    children?: ReactNode;
}
export declare function DevServerUI({ header, devServer, cwd, logfile, proxyMessage, restartAlarm, children, }: DevServerUIProps): JSX.Element;
