import { Stats } from 'webpack';
export declare enum WebpackServerStatus {
    STARTING = 0,
    STARTED = 1,
    CLOSING = 2,
    CLOSED = 3
}
export declare enum ElectronServerStatus {
    WAITING = 0,
    STARTED = 1,
    CLOSED = 2
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
/**
 * @see https://www.electronjs.org/docs/api/command-line-switches
 */
export interface ElectronSwitches {
    'ignore-connections-limit'?: string;
    'disable-http-cache'?: boolean;
    'disable-http2'?: boolean;
    'disable-ntlm-v2'?: boolean;
    lang?: string;
    inspect?: string;
    'inspect-brk'?: string;
    'remote-debugging-port'?: string;
    'disk-cache-size'?: number;
    'js-flags'?: string;
    'proxy-server'?: string;
    'proxy-bypass-list'?: string;
    'proxy-pac-url'?: string;
    'no-proxy-server'?: boolean;
    'host-rules'?: string;
    'host-resolver-rules'?: string;
    'auth-server-whitelist'?: string;
    'auth-negotiate-delegate-whitelist'?: string;
    'ignore-certificate-errors'?: boolean;
    'log-net-log'?: string;
    'disable-renderer-backgrounding'?: boolean;
    'enable-logging'?: boolean;
    v?: string;
    vmodule?: string;
    'enable-api-filtering-logging'?: boolean;
    'no-sandbox'?: boolean;
}
