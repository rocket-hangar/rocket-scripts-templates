/// <reference types="node" />
import { EventEmitter } from 'events';
import { ReactElement } from 'react';
export declare class InkWritableStream extends EventEmitter {
    get columns(): number;
    readonly frames: string[];
    private _lastFrame?;
    write: (frame: string) => void;
    lastFrame: () => string | undefined;
}
export declare function createInkWriteStream(): InkWritableStream & NodeJS.WriteStream;
export declare function inkToString(element: ReactElement): string;
