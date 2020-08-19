/**
 * @see https://www.electronjs.org/docs/api/command-line-switches
 */
export declare const electronSwitchesYargsOptions: {
    readonly 'ignore-connections-limit': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'disable-http-cache': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'disable-http2': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'disable-ntlm-v2': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly lang: {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly inspect: {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'inspect-brk': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'remote-debugging-port': {
        readonly type: "number";
        readonly describe: "* electon command-line switch";
    };
    readonly 'disk-cache-size': {
        readonly type: "number";
        readonly describe: "* electon command-line switch";
    };
    readonly 'js-flags': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'proxy-server': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'proxy-bypass-list': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'proxy-pac-url': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'no-proxy-server': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'host-rules': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'host-resolver-rules': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'auth-server-whitelist': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'auth-negotiate-delegate-whitelist': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'ignore-certificate-errors': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'log-net-log': {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'disable-renderer-backgrounding': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'enable-logging': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly v: {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly vmodule: {
        readonly type: "string";
        readonly describe: "* electon command-line switch";
    };
    readonly 'enable-api-filtering-logging': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
    readonly 'no-sandbox': {
        readonly type: "boolean";
        readonly describe: "* electon command-line switch";
    };
};
export declare type ElectronSwitchesYargsValues = {
    [Key in keyof typeof electronSwitchesYargsOptions]?: typeof electronSwitchesYargsOptions[Key]['type'] extends 'boolean' ? boolean : typeof electronSwitchesYargsOptions[Key]['type'] extends 'number' ? number : string;
};
export declare function toElectronArgv(values: ElectronSwitchesYargsValues): string[];
