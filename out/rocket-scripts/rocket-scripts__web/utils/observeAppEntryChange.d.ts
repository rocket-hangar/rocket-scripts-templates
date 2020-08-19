import { Observable } from 'rxjs';
import { AppEntry } from './getAppEntry';
interface Params {
    current: AppEntry[];
    appDir: string;
}
export declare function observeAppEntryChange({ appDir, current }: Params): Observable<string | null>;
export {};
