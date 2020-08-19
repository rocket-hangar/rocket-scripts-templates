import { MirrorMessage } from '@ssen/mirror-files';
import { ReactNode } from 'react';
import { Observable } from 'rxjs';
import { ElectronServer } from './ElectronServer';
import { WebpackServer } from './WebpackServer';
export interface DevServerUIProps {
    header?: ReactNode;
    webpackServer: WebpackServer;
    electronServer: ElectronServer;
    syncStaticFiles?: Observable<MirrorMessage>;
    cwd: string;
    logfile: string;
    restartAlarm?: Observable<string[]>;
}
export declare function DevServerUI({ header, webpackServer, electronServer, syncStaticFiles, cwd, logfile, restartAlarm, }: DevServerUIProps): JSX.Element;
