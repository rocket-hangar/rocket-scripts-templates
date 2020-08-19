import { Matcher } from 'anymatch';
import { Observable } from 'rxjs';
interface Params {
    filesDirsOrGlobs: string[];
    outDir: string;
    ignored?: Matcher;
}
export declare type MirrorMessage = {
    type: 'added' | 'updated' | 'removed';
    file: string;
    time: Date;
} | {
    type: 'undefined';
    file: string;
    time: Date;
};
export declare function mirrorFiles({ filesDirsOrGlobs, outDir, ignored }: Params): Observable<MirrorMessage>;
export {};
