import { Observable } from 'rxjs';
interface Params {
    cwd: string;
    current: Record<string, string>;
    interval?: number;
}
export declare function observeAliasChange({ cwd, current, interval }: Params): Observable<string | null>;
export {};
