import { Stats } from 'webpack';
export declare enum DevServerStatus {
    STARTING = 0,
    STARTED = 1,
    CLOSING = 2,
    CLOSED = 3
}
export declare type WebpackStats = {
    status: 'waiting' | 'invalid';
} | {
    status: 'done';
    statsData: Stats;
};
export declare type TimeMessage = {
    time: number;
    level: 'log' | 'info' | 'warn' | 'debug' | 'error';
    message: string;
};
